import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/storepolicy")({
  component: StorePolicyPage,
  head: () => ({
    meta: [{ title: "Store Policy · Looters Computas" }],
  }),
});

function StorePolicyPage() {
  return (
    <LegalPage title="Store Policy" updated="12 September 2026">
      <p>
        This Store Policy explains how Looters Computas sells, ships, warrants
        and supports refurbished computer equipment purchased through
        looterscomputas.online. It should be read together with our{" "}
        <a href="/termsandconditions">Terms and Conditions</a>. By placing an
        order you agree to this Policy.
      </p>

      <h2>1. Nature of the goods</h2>
      <p>
        Unless a listing is clearly marked as new, goods sold by Looters
        Computas are refurbished. They have been inspected, tested and prepared
        for resale. Cosmetic marks, light scratches or signs of previous use
        may be present and do not, of themselves, constitute a defect. Please
        read each product page carefully, including any notes on specification,
        inclusions (such as chargers) and condition, before you buy.
      </p>

      <h2>2. Orders, payment and shipping</h2>
      <p>
        We accept payment methods shown at checkout, including PayPal and,
        where you complete the purchase on Trade Me, Afterpay (subject to
        Afterpay’s own terms). Orders are packed after payment has cleared.
        You select shipping on the product page or in your cart; the quoted
        shipping charge forms part of your total.
      </p>
      <p>
        We ship within New Zealand. Delivery estimates are indicative. Once a
        courier has collected the parcel, transit is outside our direct
        control. Please inspect the outer packaging on arrival and notify us
        promptly if it appears damaged.
      </p>

      <h2>3. Ninety (90) day warranty</h2>
      <p>
        Each product sold by Looters Computas is covered by a ninety (90) day
        limited warranty from the date of delivery, covering faults in
        materials and workmanship that prevent the goods from working as
        reasonably described. The warranty does not cover:
      </p>
      <ul>
        <li>normal cosmetic wear, or marks disclosed in the listing;</li>
        <li>
          damage caused after delivery, including impact, liquid, electrical
          surge, unauthorised repair, or use outside ordinary purpose;
        </li>
        <li>software issues, passwords, or data you store on the device;</li>
        <li>consumables (batteries showing age-related wear consistent with
          a refurbished unit, unless the listing promised otherwise);</li>
        <li>faults reported after the ninety day period has expired.</li>
      </ul>
      <p>
        This warranty sits alongside, and does not replace, any non-excludable
        rights you have under the Consumer Guarantees Act 1993.
      </p>

      <h2>4. Returns and warranty claims — shipping responsibility</h2>
      <p>
        If you believe goods are faulty within the warranty period, contact us
        first at{" "}
        <a href="mailto:LootersRetail@protonmail.com">
          LootersRetail@protonmail.com
        </a>{" "}
        with your order details, a description of the fault, and photographs
        where helpful. Do not return goods until we have confirmed the next
        step.
      </p>
      <p>
        <strong className="text-foreground">
          The customer is responsible for paying the initial return shipping
          of the item to Looters Computas.
        </strong>{" "}
        Please retain proof of postage and pack the goods securely, ideally in
        the original packaging.
      </p>
      <p>
        On receipt we will inspect the item and determine the appropriate
        outcome (repair, replacement, refund, or a finding that the goods are
        not faulty or that the fault is not covered). That decision will be
        communicated to you in writing (email is sufficient).
      </p>
      <p>
        If, following inspection, Looters Computas accepts that the fault is
        our responsibility under this Policy or applicable New Zealand consumer
        law, we will:
      </p>
      <ul>
        <li>
          reimburse the reasonable return shipping expense you incurred to send
          the item to us, upon proof of that expense; and
        </li>
        <li>
          mediate the situation in respect of the product — which may include
          repair, replacement with an equivalent item, a refund of the purchase
          price, or another remedy we agree with you — and cover shipping of
          any replacement or returned-repaired unit back to you.
        </li>
      </ul>
      <p>
        If inspection shows the goods are not faulty, that the fault was caused
        after delivery, or that the claim falls outside this Policy, we may
        decline the claim. In that case return shipping to you, if you want the
        goods back, is at your expense unless the law requires otherwise.
      </p>
      <p>
        Change-of-mind returns are not offered as a standard right on
        refurbished electronics, except where New Zealand law requires a
        remedy. Please choose carefully.
      </p>

      <h2>5. Data and privacy on devices</h2>
      <p>
        Refurbished storage is wiped as part of our process where practicable.
        You are responsible for backing up and for removing any personal data
        before returning a device. We are not liable for data you leave on
        goods sent to us.
      </p>

      <h2>6. Contact</h2>
      <p>
        Looters Computas —{" "}
        <a href="https://looterscomputas.online">looterscomputas.online</a>
        <br />
        Email:{" "}
        <a href="mailto:LootersRetail@protonmail.com">
          LootersRetail@protonmail.com
        </a>
      </p>
    </LegalPage>
  );
}
