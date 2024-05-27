

import jsPDF from 'jspdf';
import { renderToString } from 'react-dom/server';


function PDFComponent({data, showPDF}) {
 
  const handleGeneratePdf = () => {
    var doc = new jsPDF('p', 'pt', 'a4', true);
  
    // Adding the fonts.
    doc.setFont('Inter-Regular', 'normal');
  
    const pageSize = 589; // Width of the page
  
    const htmlString = renderToString(
      <div>
        {/* Content for the first page */}
        <div style={{ padding: "20px" }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', width: '100%', textAlign: 'center' }}>Report Heading That Spans More Than Just One Line</h2>
          <p style={{ width: '100%', textAlign: "center", marginBottom: '100px' }}>
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} style={{ fontSize: '16px', display: 'block', width: '100%' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </span>
            ))}
          </p>
        </div>
  
        {/* Content for the second page */}
        <div style={{ pageBreakBefore: 'always', padding: "20px", marginBottom: '20px', marginTop:"50px" }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: '8px', width: '20%' }}>Image</th>
              <th style={{ border: '1px solid #000', padding: '8px', width: '20%' }}>Name</th>
              <th style={{ border: '1px solid #000', padding: '8px', width: '20%' }}>Quantity</th>
              <th style={{ border: '1px solid #000', padding: '8px', width: '20%' }}>Unit</th>
              <th style={{ border: '1px solid #000', padding: '8px', width: '20%' }}>Rate</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #000', padding: '8px', width: '20%' }}> <img src={item.img} alt={item.heading} style={{ width: '100px', height: '100px' }} /></td>
                <td style={{ border: '1px solid #000', padding: '8px', width: '20%' }}>{item.heading}</td>
                <td style={{ border: '1px solid #000', padding: '8px', width: '20%' }}>{item.qty}</td>
                <td style={{ border: '1px solid #000', padding: '8px', width: '20%' }}>{item.unit}</td>
                <td style={{ border: '1px solid #000', padding: '8px', width: '20%' }}>{item.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
          {/* Add an image to the second page */}
          <div style={{ pageBreakBefore: 'always', padding: "20px", marginBottom: '20px', marginTop:"50px" }}>

          <img src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhaXJ8ZW58MHx8MHx8fDA%3D" alt="Image" style={{ width: '200px', height: '200px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }} />
          </div>
        </div>
  
        {/* Content for additional pages */}
        {/* Add more content blocks as needed with proper page breaks */}
      </div>
    );
  
    doc.html(htmlString, {
      callback: () => {
        const blobURL = doc.output('bloburl'); // Generate Blob URL
        window.open(blobURL, '_blank'); // Open Blob URL in new window
      },
      width: pageSize, // <- Set the width of the content
      windowWidth: pageSize // <- Set the width of the window
    });
  };
  
  

  return (
    <div>
      <button className="button" onClick={handleGeneratePdf}>
        Generate PDF
      </button>
    </div>
  );
}

export default PDFComponent;
