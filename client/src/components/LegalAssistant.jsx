import React, { useEffect, useState } from "react";
import jsPDF from 'jspdf';
import { Form, useActionData, useNavigation } from "react-router-dom"; // Updated for modern usage
import customFetch from '../utils/customFetch'
export const action = async ({ request }) => {
  const formdata = await request.formData();
  
  // Convert FormData to object with trimmed values
  const data = Object.fromEntries(formdata);

  

  try {
    const res = await customFetch.post('/docs', data)
    console.log(res);
    return res.data.draft;
  } catch (error) {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
    return {
      error: error.response?.data?.message || 
            `Document generation failed (${error.response?.status || 'no status'})`
    };
  }
};
const basicMarkdownToHtml = (markdown) => {
  let html = markdown;

  // Basic heading replacement (atx style)
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');

  // Basic bold and italic
  html = html.replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>');
  html = html.replace(/\*(.*?)\*/gim, '<i>$1</i>');
  html = html.replace(/__(.*?)__/gim, '<b>$1</b>'); // Alternative bold
  html = html.replace(/_(.*?)_/gim, '<i>$1</i>');   // Alternative italic

  // Basic unordered lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  const ulRegex = /^(<li>.*?<\/li>\n*)+/gim;
  html = html.replace(ulRegex, '<ul>$&</ul>');

  // Basic line breaks (two spaces at the end of a line)
  html = html.replace(/  \n/g, '<br />\n');

  // Preserve newlines for other content
  html = html.replace(/\n/g, '<br />\n');

  return html;
};
// Assuming you are using React Router
const LegalAssistant = () => {
  const [type, setDocumentType] = useState("");
  const [language, setLanguage] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const data = useActionData();
// console.log(data);
  const [formData, setFormData] = useState({
    description: "",
    policeStation: "",
    name: "",
    address: "",
    contact: "",
    occupation: "",
    accusedName: "",
    accusedAddress: "",
    relationshipToComplainant: "",
    incidentDate: "",
    incidentTime: "",
    incidentPlace: "",
    natureOfOffense: "",
    witnesses: "",
    evidence: "",
    actionRequest: "",
    fullName: "",
    fatherOrHusbandName: "",
    rtiAddress: "",
    pinCode: "",
    officePhone: "",
    residencePhone: "",
    mobile: "",
    isBPL: "",
    feeDetails: {
      paymentMode: "",
      refNumber: "",
      paymentDate: "",
      issuingAuthority: "",
      amount: ""
    },
    infoRequired: "",
    preferredFormat: "",
    place: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeeDetailsChange = (e) => {
    setFormData({
      ...formData,
      feeDetails: {
        ...formData.feeDetails,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleGenerate = (e) => {
    return setShowPreview(true)
    // If validation passes, the form will submit and the action will be called
    // After the action returns data, the 'data' state will be updated
  };

  // const handleDownload = () => {
  //   if (data) {
  //     const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = `legal_document.${language === 'Hindi' ? 'pdf' : 'pdf'}`; // You might want to adjust the filename
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);
  //   }
  // };
const handleDownload = () => {
  if (data) {
    const doc = new jsPDF('p', 'mm', 'a4'); // 'a4' specifies the A4 page size
    doc.text(data, 10, 10);
    doc.save(`legal_document.pdf`);
  }
};


  // useEffect(() => {
  //   if (data) {
  //     setShowPreview(true);
  //   } else {
  //     setShowPreview(false);
  //   }
  // }, [data]);

  const cardData = [
    {
      head: "Police & Criminal Matters",
      i1: "/c1.png",
      i2: "/c2.png",
      i3: "/c3.png",
      g: "/1st2.png",
      h1: "First Information Report (FIR)",
      h2: "Police Complaint",
      h3: "Missing Person Report",
    },
    {
      head: "Government Requests",
      i1: "/c4.png",
      i2: "/c5.png",
      i3: "/c6.png",
      g: "/2nd.png",
      h1: "RTI Application",
      h2: "Public Grievance Petition",
      h3: "Government Service Complaint",
    },
    {
      head: "Civil Matters",
      i1: "/c7.png",
      i2: "/c8.png",
      i3: "/c9.png",
      g: "/3rd.png",
      h1: "Consumer Complaint",
      h2: "Tenant/Landlord Notices",
      h3: "Small Cases Filing",
    },
    {
      head: "Personal & Legal Documents",
      i1: "/c10.png",
      i2: "/c11.png",
      i3: "/c12.png",
      g: "/4th.png",
      h1: "Affidavit Template",
      h2: "Legal Notice Format",
      h3: "Power of Attorney",
    },
  ];
const navigation = useNavigation()
  return (
  <>
  <div className="flex gap-4 justify-evenly pb-12 items-center mt-12">
    {cardData.map((item, index) => {
      const { head, g, h1, h2, h3, i1, i2, i3 } = item;
      return (
        <div
          key={index}
          className="min-w-[22vw] bg-white shadow-sm hover:shadow-xl transition-all duration-300 min-h-[52vh] border-t-4 rounded-[8px] border-blue-900"
        >
          <div className="flex flex-col justify-center items-start p-5">
            <div className="flex gap-x-3 max-w-[20vw] justify-start mt-4 items-center">
              <img src={g} alt="category-icon" className="h-[45px] w-[45px]" />
              <h1 className="font-bold text-[20px] leading-[20px] ml-1 text-[#0A2342]">{head}</h1>
            </div>
            <div className="mt-8 mx-3 flex flex-col gap-y-2 justify-center min-w-[16vw] max-w-[18vw] items-start">
              {[{ icon: i1, text: h1 }, { icon: i2, text: h2 }, { icon: i3, text: h3 }].map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center justify-center mt-5">
                  <img src={item.icon} alt="icon" className="w-[18px] h-[18px]" />
                  <h1 className="text-[16px] font-normal leading-[20px] text-[#000000]">{item.text}</h1>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    })}
  </div>

  <div className="p-6 max-w-[800px] mx-auto flex flex-col items-center">
    <h1 className="text-2xl font-bold mb-4">Create Legal Document</h1>
    <p className="text-sm text-red-600 mb-4">⚠️ All fields are compulsory. Please fill them carefully.</p>

    <Form method="post" onSubmit={handleGenerate} className="space-y-4 w-full">
      <div>
        <label>Select Document Type</label>
        <select name="type" value={type} onChange={(e) => setDocumentType(e.target.value)} className="w-full p-2 border rounded" required>
          <option value="">Select Document Type</option>
          <option value="FIR">FIR</option>
          <option value="RTI">RTI</option>
        </select>
      </div>

      <div>
        <label>Select Language</label>
        <select name="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border rounded" required>
          <option value="">Select Language</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
        </select>
      </div>

      {type === "FIR" && (
        <>
          {[
            { name: "description", type: "textarea" },
            { name: "policeStation" },
            { name: "name" },
            { name: "address" },
            { name: "contact" },
            { name: "occupation" },
            { name: "accusedName" },
            { name: "accusedAddress" },
            { name: "relationshipToComplainant" },
            { name: "incidentDate", type: "date" },
            { name: "incidentTime", type: "time" },
            { name: "incidentPlace" },
            { name: "natureOfOffense" },
            { name: "witnesses", type: "textarea" },
            { name: "evidence", type: "textarea" },
            { name: "actionRequest", type: "textarea" },
          ].map(({ name, type = "text" }) => (
            <div key={name}>
              <label className="capitalize">{name.replace(/([A-Z])/g, ' $1')}</label>
              {type === "textarea" ? (
                <textarea name={name} required placeholder={name.replace(/([A-Z])/g, ' $1')} onChange={handleChange} className="w-full p-2 border rounded" />
              ) : (
                <input name={name} type={type} required placeholder={name.replace(/([A-Z])/g, ' $1')} onChange={handleChange} className="w-full p-2 border rounded" />
              )}
            </div>
          ))}
        </>
      )}

      {type === "RTI" && (
        <>
          {[
            "fullName",
            "fatherOrHusbandName",
            "rtiAddress",
            "pinCode",
            "officePhone",
            "residencePhone",
            "mobile",
            "isBPL",
          ].map((name) => (
            <div key={name}>
              <label className="capitalize">{name.replace(/([A-Z])/g, ' $1')}</label>
              <input name={name} required placeholder={name.replace(/([A-Z])/g, ' $1')} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          ))}

          <div className="space-y-4 p-4 border rounded">
            <h3 className="font-bold">Fee Details</h3>
            {[
              { name: "paymentMode", type: "select", options: ["Demand Draft", "Banker's Cheque", "Cash", "Online Payment"] },
              { name: "refNumber" },
              { name: "paymentDate", type: "date" },
              { name: "issuingAuthority" },
              { name: "amount", type: "number" },
            ].map(({ name, type = "text", options }) => (
              <div key={name}>
                <label className="capitalize">{name.replace(/([A-Z])/g, ' $1')}</label>
                {type === "select" ? (
                  <select name={name} required value={formData.feeDetails[name]} onChange={handleFeeDetailsChange} className="w-full p-2 border rounded">
                    <option value="">Select {name.replace(/([A-Z])/g, ' $1')}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={name}
                    type={type}
                    placeholder={name.replace(/([A-Z])/g, ' $1')}
                    value={formData.feeDetails[name]}
                    required
                    onChange={handleFeeDetailsChange}
                    className="w-full p-2 border rounded"
                  />
                )}
              </div>
            ))}
          </div>

          {["infoRequired", "preferredFormat", "place", "date"].map((name) => (
            <div key={name}>
              <label className="capitalize">{name.replace(/([A-Z])/g, ' $1')}</label>
              <input
                name={name} required
                type={name === "date" ? "date" : "text"}
                placeholder={name.replace(/([A-Z])/g, ' $1')}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </>
      )}

      <div className="flex justify-center items-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {navigation.state === 'submitting' ? "Generating" : "Generate"}
        </button>
      </div>
    </Form>

    {data && (
      <div className="mt-8 p-6 rounded border border-gray-400 shadow-2xl">
        <h2 className="text-xl font-bold mb-2">Preview</h2>
        <div
          className="whitespace-pre-wrap flex justify-center items-center"
          dangerouslySetInnerHTML={{ __html: basicMarkdownToHtml(data) }}
        />
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Download
        </button>
      </div>
    )}
  </div>
</>

  );
};

export default LegalAssistant;



