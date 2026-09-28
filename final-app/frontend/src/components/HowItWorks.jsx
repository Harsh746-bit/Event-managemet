import React from 'react';

export default function HowItWorks() {
  return (
    <section className="cc-section bg-white border-bottom">
      <div className="container">
        <div className="text-center mb-5">
          <div className="cc-eyebrow justify-content-center">Three Simple Steps</div>
          <h2 className="cc-section-title">HOW CAMPUSCONNECT WORKS</h2>
          <p className="cc-section-sub mx-auto">Get involved with university experiences in less than sixty seconds.</p>
        </div>

        <div className="row align-items-center g-4 text-center text-md-start">
          <div className="col-md-3">
            <div className="step-item">
              <div className="step-num">01</div>
              <div className="step-title">DISCOVER</div>
              <div className="step-desc">Filter campus events by category or search real-time availability from REST API.</div>
            </div>
          </div>
          <div className="col-md-1 d-none d-md-flex justify-content-center text-muted fs-4">
            <i className="bi bi-arrow-right"></i>
          </div>
          <div className="col-md-3">
            <div className="step-item">
              <div className="step-num">02</div>
              <div className="step-title">REGISTER</div>
              <div className="step-desc">Submit your details; server validates and atomically assigns your digital seat.</div>
            </div>
          </div>
          <div className="col-md-1 d-none d-md-flex justify-content-center text-muted fs-4">
            <i className="bi bi-arrow-right"></i>
          </div>
          <div className="col-md-4">
            <div className="step-item">
              <div className="step-num">03</div>
              <div className="step-title">PARTICIPATE</div>
              <div className="step-desc">Show your confirmed Pass ID at the gate and claim your certificate credentials.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
