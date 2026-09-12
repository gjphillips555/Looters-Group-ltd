import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/termsandconditions")({
  component: TermsPage,
  head: () => ({
    meta: [{ title: "Terms and Conditions · Looters Computas" }],
  }),
});

function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions" updated="12 September 2026">
      <p>
        These Terms and Conditions (“Terms”) govern your access to and use of
        the Looters Computas website at looterscomputas.online (the “Site”),
        and any purchase of goods from Looters Computas (“we”, “us”, “our”).
        By browsing the Site, creating an account, or placing an order, you
        agree to be bound by these Terms and by our{" "}
        <a href="/storepolicy">Store Policy</a>. If you do not agree, please
        do not use the Site or purchase from us.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Looters Computas is a New Zealand retailer of refurbished computers,
        laptops, graphics cards, components and related accessories. We trade
        online only. Enquiries:{" "}
        <a href="mailto:LootersRetail@protonmail.com">
          LootersRetail@protonmail.com
        </a>
        .
      </p>

      <h2>2. Terms of purchasing from Looters Computas</h2>
      <p>
        All prices are displayed in New Zealand dollars (NZD) and are inclusive
        of GST unless we state otherwise. A contract is formed when we accept
        your order and payment is successfully received (including via PayPal
        or Trade Me). We may decline or cancel an order if stock is unavailable,
        if pricing is obviously in error, or if we reasonably suspect fraud.
      </p>
      <p>
        Product descriptions, photographs and specifications are provided in
        good faith. Refurbished goods may show cosmetic wear consistent with
        prior use. It is your responsibility to read the listing, including
        condition notes, before you buy. Title in the goods passes to you once
        we have received payment in full and the goods have been dispatched.
      </p>
      <p>
        Shipping is arranged at checkout. Delivery timeframes are estimates,
        not guarantees. Risk in the goods passes on delivery to the address you
        provide. You must supply accurate name, email, phone and delivery
        details. We are not responsible for loss caused by an incorrect address
        you entered.
      </p>
      <p>
        Afterpay, where offered, is provided through Trade Me’s checkout and
        is subject to Afterpay’s own eligibility criteria, late fees and
        terms. PayPal payments are processed by PayPal; we never receive your
        full card number.
      </p>

      <h2>3. Consumer guarantees (New Zealand)</h2>
      <p>
        Nothing in these Terms limits your rights under the Consumer Guarantees
        Act 1993 or the Fair Trading Act 1986, except to the extent the law
        allows when you are acquiring goods for business purposes. If you are
        acquiring goods for the purpose of a business, the Consumer Guarantees
        Act 1993 is excluded to the fullest extent permitted by law.
      </p>

      <h2>4. Terms of signing up to Looters Computas</h2>
      <p>
        An account with us is optional. You may browse and purchase as a guest.
        If you choose to sign in, you may do so with Google or any other sign-up
        method we make available from time to time.
      </p>
      <p>
        By creating an account, or by signing in with Google or another
        identity provider, you confirm that:
      </p>
      <ul>
        <li>you are at least 18 years of age;</li>
        <li>
          the information associated with that account (name and email) is
          accurate, and you are authorised to use that Google (or other)
          account;
        </li>
        <li>
          you have read and agree to these Terms and to our Store Policy;
        </li>
        <li>
          you will keep your sign-in credentials confidential and notify us
          promptly of any unauthorised use.
        </li>
      </ul>
      <p>
        When you sign in with Google, Google authenticates you and shares with
        us the profile information you permit (typically your name, email
        address and profile photo). We use that information only to identify
        your session, pre-fill checkout where you choose, and communicate about
        your orders. We do not receive or store your Google password.
      </p>
      <p>
        We may suspend or close an account if we reasonably believe these Terms
        have been breached, or if required by law. You may stop using the Site
        at any time. Signing out does not cancel orders already placed.
      </p>

      <h2>5. Acceptable use</h2>
      <p>
        You must not misuse the Site, attempt to interfere with its security or
        availability, scrape it in a way that imposes an unreasonable load, or
        use it for any unlawful purpose. Hidden or staff-only areas of the Site
        are not for public use.
      </p>

      <h2>6. Liability</h2>
      <p>
        To the maximum extent permitted by New Zealand law, we are not liable
        for indirect, incidental or consequential loss, or for loss of profit,
        data or business opportunity. Our aggregate liability arising out of
        any order is limited to the amount you paid for the relevant goods.
        This clause does not exclude liability that cannot be excluded by law.
      </p>

      <h2>7. Changes</h2>
      <p>
        We may update these Terms from time to time. The version published on
        this page is the current version. Continued use of the Site after a
        change constitutes acceptance of the updated Terms. Material changes
        to warranty or returns are described in the Store Policy.
      </p>

      <h2>8. Governing law</h2>
      <p>
        These Terms are governed by the laws of New Zealand. The New Zealand
        courts have exclusive jurisdiction, except that we may seek injunctive
        relief in any jurisdiction.
      </p>

      <p>
        Questions about these Terms:{" "}
        <a href="mailto:LootersRetail@protonmail.com">
          LootersRetail@protonmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
