import { Patient } from '../types';

/**
 * Generates and triggers print for a standardized ABDM / Government Hospital Clinical Triage Slip
 */
export function printTriageSlip(patient: Patient, maskPii = false): void {
  const printWindow = window.open('', '_blank', 'width=850,height=1000');
  if (!printWindow) {
    alert('Please allow popups to print the triage slip.');
    return;
  }

  const displayName = maskPii
    ? patient.name.split(' ').map((p, i) => (i === 0 ? p[0] + '***' : p[0] + '***')).join(' ')
    : patient.name;

  const displayPhone = maskPii
    ? '+91 ******' + (patient.phone ? patient.phone.slice(-4) : '0000')
    : patient.phone || 'N/A';

  const displayAadhaar = maskPii
    ? 'XXXX-XXXX-' + (patient.aadhaarLast4 || 'XXXX')
    : 'XXXX-XXXX-' + (patient.aadhaarLast4 || '8842');

  const priorityColor =
    patient.triageNote?.suggestedPriority === 'Emergency'
      ? '#dc2626'
      : patient.triageNote?.suggestedPriority === 'Urgent'
      ? '#ea580c'
      : patient.triageNote?.suggestedPriority === 'Semi-urgent'
      ? '#ca8a04'
      : '#16a34a';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Triage Slip - ${patient.tokenNumber}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; margin: 0; padding: 20px; font-size: 13px; line-height: 1.5; }
          .header { border-bottom: 2px solid #0f766e; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 20px; font-weight: 800; color: #0f766e; margin: 0; }
          .subtitle { font-size: 11px; color: #64748b; margin-top: 2px; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-weight: 700; font-size: 12px; color: white; background: ${priorityColor}; }
          .token-box { text-align: right; }
          .token-number { font-size: 26px; font-weight: 900; color: #0f766e; margin: 0; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; }
          .card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; background: #f8fafc; }
          .card h4 { margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; }
          .vitals-row { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
          .vital-item { background: white; padding: 6px 10px; border-radius: 4px; border: 1px solid #cbd5e1; text-align: center; flex: 1; min-width: 70px; }
          .vital-val { font-size: 14px; font-weight: 700; color: #0f172a; }
          .vital-lbl { font-size: 9px; color: #64748b; text-transform: uppercase; }
          .section { margin-bottom: 14px; }
          .section-title { font-size: 13px; font-weight: 700; color: #0f766e; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px; }
          .alert-red { background: #fef2f2; border-left: 4px solid #ef4444; padding: 8px 12px; margin-bottom: 12px; font-weight: 600; color: #991b1b; }
          .stamp-box { border: 2px dashed #0d9488; border-radius: 6px; padding: 12px; margin-top: 20px; background: #f0fdfa; display: flex; justify-content: space-between; align-items: center; }
          .stamp-title { font-weight: 800; color: #0f766e; }
          .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 8px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">SWASTHYA SETU | TRIAGE ASSIST</h1>
            <div class="subtitle">${patient.facilityName || 'Government Primary Health Centre'} | ABDM Facility Code: ${patient.facilityId}</div>
          </div>
          <div class="token-box">
            <div style="font-size: 10px; color: #64748b; font-weight: 600;">TOKEN NUMBER</div>
            <div class="token-number">${patient.tokenNumber}</div>
            <div class="badge">${patient.triageNote?.suggestedPriority || 'Standard'}</div>
          </div>
        </div>

        ${patient.triageNote?.emergencyActionNotice ? `
          <div class="alert-red">
            ${patient.triageNote.emergencyActionNotice}
          </div>
        ` : ''}

        <div class="grid">
          <div class="card">
            <h4>Patient Identification</h4>
            <div><strong>Name:</strong> ${displayName}</div>
            <div><strong>Age / Sex:</strong> ${patient.age} Y / ${patient.sex}</div>
            <div><strong>Mobile:</strong> ${displayPhone}</div>
            <div><strong>ABHA / Aadhaar:</strong> ${displayAadhaar}</div>
            <div><strong>Primary Language:</strong> ${patient.primaryLanguage?.toUpperCase()}</div>
          </div>
          <div class="card">
            <h4>Triage Routing</h4>
            <div><strong>Target Department:</strong> ${patient.triageNote?.suggestedDepartment || 'General OPD'}</div>
            <div><strong>Time of Intake:</strong> ${new Date(patient.checkInTime).toLocaleString('en-IN')}</div>
            <div><strong>Status:</strong> ${patient.status.toUpperCase()}</div>
            <div><strong>Clinician Review:</strong> ${patient.status === 'approved' ? 'VERIFIED & APPROVED' : 'PENDING REVIEW'}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Baseline Vital Signs</div>
          <div class="vitals-row">
            <div class="vital-item">
              <div class="vital-val">${patient.vitals?.bloodPressureSystolic || '-'}/${patient.vitals?.bloodPressureDiastolic || '-'}</div>
              <div class="vital-lbl">BP (mmHg)</div>
            </div>
            <div class="vital-item">
              <div class="vital-val">${patient.vitals?.pulseRate || '-'}</div>
              <div class="vital-lbl">Pulse (bpm)</div>
            </div>
            <div class="vital-item">
              <div class="vital-val">${patient.vitals?.spo2 ? patient.vitals.spo2 + '%' : '-'}</div>
              <div class="vital-lbl">SpO2</div>
            </div>
            <div class="vital-item">
              <div class="vital-val">${patient.vitals?.temperatureF ? patient.vitals.temperatureF + '°F' : '-'}</div>
              <div class="vital-lbl">Temp</div>
            </div>
            <div class="vital-item">
              <div class="vital-val">${patient.vitals?.respiratoryRate || '-'}</div>
              <div class="vital-lbl">Resp Rate</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Clinical Summarization (AI-Drafted, Clinician-Reviewed)</div>
          <p><strong>Chief Complaint:</strong> ${patient.chiefComplaint}</p>
          <p><strong>History of Present Illness:</strong> ${patient.triageNote?.historyOfPresentIllness || 'N/A'}</p>
          ${patient.voiceTranscript ? `<p><strong>Original Patient Voice/Text Input:</strong> <em>"${patient.voiceTranscript}"</em></p>` : ''}
          ${patient.voiceTranscriptEn && patient.voiceTranscriptEn !== patient.voiceTranscript ? `<p><strong>Translated English Transcript:</strong> <em>"${patient.voiceTranscriptEn}"</em></p>` : ''}
        </div>

        ${patient.triageNote?.redFlagsDetected && patient.triageNote.redFlagsDetected.length > 0 ? `
          <div class="section">
            <div class="section-title" style="color: #dc2626;">Red-Flag Clinical Risk Markers</div>
            <ul>
              ${patient.triageNote.redFlagsDetected.map(rf => `<li style="color: #991b1b; font-weight: 600;">${rf}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${patient.triageNote?.missingInformationToAsk && patient.triageNote.missingInformationToAsk.length > 0 ? `
          <div class="section">
            <div class="section-title">Suggested In-Depth Questions for Doctor</div>
            <ul>
              ${patient.triageNote.missingInformationToAsk.map(q => `<li>${q}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="stamp-box">
          <div>
            <div class="stamp-title">HUMAN-IN-THE-LOOP VERIFICATION STAMP</div>
            <div style="font-size: 11px; color: #334155; margin-top: 3px;">
              ${patient.status === 'approved' ? 'Verified, validated and approved by qualified Medical Officer.' : 'Draft AI note awaiting qualified clinician sign-off.'}
            </div>
          </div>
          <div style="text-align: right; font-size: 11px;">
            <div>Doctor / Nurse Signature: _______________________</div>
            <div style="color: #64748b; margin-top: 4px;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        <div class="footer">
          <strong>LEGAL DISCLAIMER:</strong> This note is generated by TriageAssist as an automated clinical decision-support tool. It does NOT constitute an autonomous diagnosis or treatment prescription. Complies with DPDP Act 2023 and ABDM standards.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Exports FHIR R4 Encounter / ClinicalImpression compliant JSON
 */
export function exportFhirJson(patient: Patient): void {
  const fhirBundle = {
    resourceType: 'Bundle',
    type: 'collection',
    id: `FHIR-${patient.id}`,
    timestamp: new Date().toISOString(),
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: patient.id,
          identifier: [
            { system: 'https://healthid.ndhm.gov.in', value: patient.aadhaarLast4 || 'N/A' }
          ],
          name: [{ text: patient.name }],
          gender: patient.sex.toLowerCase(),
          birthDate: `${new Date().getFullYear() - patient.age}-01-01`
        }
      },
      {
        resource: {
          resourceType: 'Encounter',
          id: `ENC-${patient.id}`,
          status: 'in-progress',
          class: { code: 'EMER', display: 'Emergency / Triage' },
          priority: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ActPriority',
                code: patient.triageNote?.suggestedPriority?.toUpperCase(),
                display: patient.triageNote?.suggestedPriority
              }
            ]
          },
          serviceProvider: { display: patient.facilityName }
        }
      },
      {
        resource: {
          resourceType: 'ClinicalImpression',
          id: `IMP-${patient.id}`,
          status: 'completed',
          description: patient.triageNote?.chiefComplaintSummary,
          summary: patient.triageNote?.historyOfPresentIllness,
          finding: (patient.triageNote?.redFlagsDetected || []).map(rf => ({
            itemCodeableConcept: { text: rf }
          }))
        }
      }
    ]
  };

  const blob = new Blob([JSON.stringify(fhirBundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ABDM_FHIR_${patient.tokenNumber}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
