import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { deliverLead } from "@/lib/lead-delivery";
import { logStructuredEvent } from "@/lib/lead-store";

function verifyCalSignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const normalized = signatureHeader.replace(/^sha256=/i, "").trim();
  if (expected.length !== normalized.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(normalized, "utf8"));
}

/**
 * Verifies Cal.com booking webhooks (BOOKING_CREATED / RESCHEDULED / CANCELLED)
 * so confirmed calls update CRM / persistence without treating click events as bookings.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const secret = process.env.CAL_WEBHOOK_SECRET;
  const sig = request.headers.get("x-cal-signature-256");

  if (secret && !verifyCalSignature(rawBody, sig, secret)) {
    logStructuredEvent("cal_webhook_invalid_signature", {});
    return NextResponse.json({ ok: false, error: "Invalid webhook signature." }, { status: 401 });
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const triggerEvent = typeof parsed.triggerEvent === "string" ? parsed.triggerEvent : "UNKNOWN";
  const data = (parsed.payload && typeof parsed.payload === "object" ? parsed.payload : {}) as Record<string, unknown>;
  const uid = typeof data.uid === "string" ? data.uid : typeof data.bookingId === "number" ? String(data.bookingId) : undefined;
  const attendees = Array.isArray(data.attendees) ? data.attendees : [];
  const primaryAttendee = (attendees[0] && typeof attendees[0] === "object" ? attendees[0] : {}) as Record<string, unknown>;
  const attendeeEmail = typeof primaryAttendee.email === "string" ? primaryAttendee.email : undefined;
  const attendeeName = typeof primaryAttendee.name === "string" ? primaryAttendee.name : undefined;

  try {
    const outcome = await deliverLead({
      kind: "cal-booking",
      subject: `Cal.com ${triggerEvent}: ${attendeeName || uid || "Booking"}`,
      text: `Event: ${triggerEvent}\nBooking ID: ${uid || "unknown"}\nAttendee: ${attendeeName || "unknown"} (${attendeeEmail || "hidden"})`,
      replyTo: attendeeEmail,
      idempotencyKey: uid ? `cal:${triggerEvent}:${uid}` : undefined,
      payload: {
        triggerEvent,
        bookingUid: uid,
        startTime: typeof data.startTime === "string" ? data.startTime : undefined,
        endTime: typeof data.endTime === "string" ? data.endTime : undefined,
        attendeeName,
        attendeeEmail,
      },
    });
    if (!outcome.configured && !outcome.persisted.persisted) {
      return NextResponse.json({ ok: false, error: "No webhook persistence or CRM endpoint configured." }, { status: 503 });
    }
    return NextResponse.json({ ok: true, triggerEvent, recordId: outcome.persisted.recordId });
  } catch (err) {
    logStructuredEvent("cal_webhook_error", { error: err instanceof Error ? err.message : "unknown" });
    return NextResponse.json({ ok: false, error: "Failed to process Cal.com webhook." }, { status: 502 });
  }
}
