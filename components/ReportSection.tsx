import React from 'react';

interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ title, children }) => {
  return (
    <section className="bg-brand-surface border border-brand-border rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold text-brand-text-light mb-4 pb-2 border-b-2 border-brand-border">{title}</h2>
      <div>{children}</div>
    </section>
  );
};
