// Copyright (c) 2024, Palak Padalia and contributors
// For license information, please see license.txt
frappe.ui.form.on("Product QR", {

  refresh(frm) {
    
    const pageSize = 9;
      let currentPage = 1;
      let totalCount = 0;

      const loadQRData = (page = 1) => {
          const offset = (page - 1) * pageSize;
          
          frappe.call({
              method: "reward_management.reward_management.doctype.qr_data.qr_data.view_follow_up_enquiry",
              args: {
                  docname: frm.doc.name,
                  limit_page_length: pageSize,
                  limit_start: offset
              },
              callback: function(response) {
                // console.log("qr code response", response);
                  const result = response.message;
                  const qrItems = result.data;
                  totalCount = result.total_count;
                  
                  if (!qrItems) return;

                  // Generate QR cards HTML
                  let qrHtmlContent = generateQRCardsHTML(qrItems);
                  
                  // Add pagination controls
                  qrHtmlContent += generatePaginationHTML(page, pageSize, totalCount);
                  
                  frm.set_df_property("qr_data", "options", qrHtmlContent);
                  frm.refresh_field("qr_data");
              }
          });
      };

      const generateQRCardsHTML = (qrItems) => {
          const getSafeValue = val => val !== null && val !== undefined && val !== "" ? val : "&nbsp;";
          const getScannedStatus = val => val == 1 ? "Scanned" : "Not Scanned";

          let html = `
              <style>
                  .qr-grid {
                      display: grid;
                      grid-template-columns: repeat(1, minmax(0, 1fr));
                      gap: 10px;
                      max-width: 360px;
                      margin-left: auto;
                      margin-right: auto;
                  }
                  @media (min-width: 768px) {
                      .qr-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: none; }
                  }
                  @media (min-width: 1140px) {
                      .qr-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                  }
                  .qr-card {
                      min-width: 200px;
                      box-shadow: 0px 0px 15px rgba(0,0,0,0.1);
                      padding: 10px;
                      border-radius: 15px;
                      font-size: 13px;
                  }
                  p { margin-bottom: 5px !important; }
                  .pagination {
                      display: flex;
                      justify-content: center;
                      gap: 10px;
                      margin: 15px 0;
                  }
                  .pagination button {
                      padding: 5px 10px;
                      border-radius: 5px;
                      border: 1px solid #ccc;
                      background-color: #f9f9f9;
                  }
              </style>
              <div class='qr-grid w-100' style='padding:10px 0;'>
          `;

          qrItems.forEach(qr => {
              html += `
                  <div class='qr-card'>
                      <p class='d-none unique-id'>${getSafeValue(qr.name)}</p>
                      <p><strong>Scanned:</strong> <span class='text-danger'>${getScannedStatus(qr.scanned)}</span></p>
                      <p><strong>Product QR Table:</strong> ${getSafeValue(qr.product_qr_name)}</p>
                      <p><strong>Product Name:</strong> ${getSafeValue(qr.product_table_name)}</p>
                      <p><strong>Product QR ID:</strong> ${getSafeValue(qr.product_qr_id)}</p>
                      <p><strong>QR Image:</strong> ${getSafeValue(qr.qr_code_image)}</p>
                      <p><strong>Points:</strong> ${getSafeValue(qr.points)}</p>
                      <p><strong>Earned Amount:</strong> ${getSafeValue(qr.earned_amount)}</p>
                      <p><strong>Generated Date:</strong> ${getSafeValue(qr.generated_date)}</p>
                      <p><strong>Generated Time:</strong> ${getSafeValue(qr.generated_time)}</p>
                      <p><strong>Carpenter ID:</strong> ${getSafeValue(qr.carpenter_id)}</p>
                      <p><strong>Redeemed Date:</strong> ${getSafeValue(qr.redeem_date)}</p>
                  </div>
              `;
          });

          html += `</div>`;
          return html;
      };

      const generatePaginationHTML = (currentPage, pageSize, totalCount) => {
          const totalPages = Math.ceil(totalCount / pageSize);
          
          return `
              <div class='pagination'>
                  <button ${currentPage <= 1 ? 'disabled' : ''} onclick="loadQRPage(${currentPage - 1})">Previous</button>
                  <span>Page ${currentPage} of ${totalPages}</span>
                  <button ${currentPage >= totalPages ? 'disabled' : ''} onclick="loadQRPage(${currentPage + 1})">Next</button>
              </div>
          `;
      };

      // Global function for pagination
      window.loadQRPage = function(page) {
          if (page < 1 || page > Math.ceil(totalCount / pageSize)) return;
          currentPage = page;
          loadQRData(currentPage);
      };

      // Initial load
      loadQRData(currentPage);
  }
  
});

