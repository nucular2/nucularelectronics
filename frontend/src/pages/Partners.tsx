import Header from "../components/Header";

export default function Partners() {
  return (
    <>
      <Header variant="white" />
      <div className="page-content-white">
        <div className="partners-layout">
          <h1 className="partners-title">For partners</h1>

          <h2 className="partners-section-title">Introduction</h2>
          <p className="partners-text">
            Hey, if you read these rules, then you want to become a partner of the Nucular company. We look forward to long-term cooperation, building a successful business, and participating in the development of the electric transport industry. We expect professional work, attentive customer service, and prompt <span className="partners-accent">technical support</span>.
          </p>
          <p className="partners-text">
            To become our partner your company must meet certain requirements.
          </p>

          <h2 className="partners-section-title">Business requirements</h2>
          <p className="partners-text">
            We give preference to companies which not resell all our devices but make their own e-bikes projects or provide for clients full installation and setup services of Nucular controllers. Your team and your business must meet the following requirements:
          </p>
          <ol className="partners-list partners-list--numbered">
            <li>Experience in the light electric transport areas, such as e-bikes, and e-scooters.</li>
            <li>Company website with an online store.</li>
            <li>Workshop for e-bikes with the necessary equipment.</li>
            <li>Offline store (not necessary, but it will be an advantage).</li>
          </ol>

          <h2 className="partners-section-title">Equipment requirements</h2>
          <h3 className="partners-subtitle">Tools:</h3>
          <ol className="partners-list partners-list--numbered">
            <li>Multimeter — necessary for basic fault diagnostic, don’t use a very cheap one.</li>
            <li>Soldering iron — we hope you won’t have to use it for repair.</li>
            <li>PHD2.0 Crimper and connectors — it may be needed to fix the user broken cables.</li>
          </ol>

          <h3 className="partners-subtitle">Optional:</h3>
          <ul className="partners-list partners-list--bulleted">
            <li>BLDC motor with Hall sensors — in combination with power supply, used to check faulty halls or phases.</li>
            <li>Spare nucular display — 100% working one to check if CAN bus has the fault.</li>
          </ul>

          <h2 className="partners-section-title">Support requirements</h2>
          <p className="partners-text">
            We provide full technical support for our partners by E-mail, Telegram, WhatsApp, and Facebook messenger. We don’t provide support by phone. The maximum response time to a request from the partner from our side is no more than a day, except Saturday.
          </p>
          <p className="partners-text">
            Our partners must provide technical support for their clients as the first line of support and must study all instructions in our <span className="partners-accent">Wiki</span>. We are ready to answer any questions and help to understand our products while studying the instructions. It is very important to us that the partner provides fast, high-quality, and competent technical support. It is necessary to be polite and attentive to customers, regardless of their level of technical expertise.
          </p>
          <p className="partners-text">
            In the difficult case, partners can connect with the Nucular team for solving the problems with hardware, firmware, or with the setup of functions.
          </p>
          <p className="partners-text">
            If you meet these requirements, please fill out the form.
          </p>

          <button className="partners-cta">Leave a request</button>
        </div>
      </div>
    </>
  );
}
