import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container not-found">
      <p className="eyebrow">ManasFlow / 404</p>
      <h1>
        A different
        <br />
        <em>starting point.</em>
      </h1>
      <p>We couldn’t find that page. Let’s take you back.</p>
      <Link className="button button-dark" href="/">
        Back to ManasFlow
      </Link>
    </section>
  );
}
