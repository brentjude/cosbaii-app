"use client";

const BetaBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-lg mb-4 p-6 text-white">
      <h1 className="text-3xl mb-2 font-paytone">
        Cosbaii is still in Beta!
      </h1>
      <p className="text-white/90">
        Cosbaii is in early access. Features may change as we continue
        development
        <br /> You may experience bugs and glitches. Don&apos;t forget to
        submit a feedback!
      </p>
    </div>
  );
};

export default BetaBanner;