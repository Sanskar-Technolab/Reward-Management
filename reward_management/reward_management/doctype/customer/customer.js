// Copyright (c) 2024, Palak Padalia
// For license information, please see license.txt

frappe.ui.form.on("Customer", {
    refresh(frm) {
        // ===== PRODUCT POINTS SECTION =====
        const pageSize = 9;
        let productCurrentPage = 1;
        let productTotalCount = 0;

        const loadProductData = (page = 1) => {
            const offset = (page - 1) * pageSize;

            frappe.call({
                method: "reward_management.reward_management.doctype.customer_product_point_detail.customer_product_point_detail.view_product_point_details",
                args: {
                    docname: frm.doc.name,
                    limit_page_length: pageSize,
                    limit_start: offset
                },
                callback: function (response) {
                    console.log("Product point details response", response);
                    const result = response.message;
                    const productItems = result.data;
                    productTotalCount = result.total_count;

                    if (!productItems) return;

                    let productHtml = productPointDetailsCardsHTML(productItems);
                    productHtml += productPointDetailsPaginationHTML(page, pageSize, productTotalCount);

                    frm.set_df_property("product_point_history", "options", productHtml);
                    frm.refresh_field("product_point_history");
                }
            });
        };

        const productPointDetailsCardsHTML = (items) => {
            const getSafeValue = val => val !== null && val !== undefined && val !== "" ? val : "&nbsp;";

            let html = `
                <style>
                    .product-point-grid {
                        display: grid;
                        grid-template-columns: repeat(1, minmax(0, 1fr));
                        gap: 10px;
                        max-width: 360px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    @media (min-width: 768px) {
                        .product-point-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: none; }
                    }
                    @media (min-width: 1140px) {
                        .product-point-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                    }
                    .product-point-card {
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
                <div class='product-point-grid'>
            `;

            items.forEach(product => {
                html += `
                    <div class='product-point-card'>
                        <p><strong>Product Image:</strong><br><img src="${getSafeValue(product.product_image)}" alt="Product Image" style="max-width: 100px; height: auto; margin-top: 5px;" /></p>
                        <p class='d-none unique-id'>${getSafeValue(product.name)}</p>
                        <p><strong>Customer ID:</strong> ${getSafeValue(product.customer_id)}</p>
                        <p><strong>Customer Full Name:</strong> ${getSafeValue(product.customer_full_name)}</p>
                        <p><strong>Product ID:</strong> ${getSafeValue(product.product_id)}</p>
                        <p><strong>Product Name:</strong> ${getSafeValue(product.product_name)}</p>
                        <p><strong>Product Category:</strong> ${getSafeValue(product.product_category)}</p>
                        <p><strong>Earned Points:</strong> ${getSafeValue(product.earned_points)}</p>
                        <p><strong>Earned Amount:</strong> ${getSafeValue(product.earned_amount)}</p>
                        <p><strong>Date:</strong> ${getSafeValue(product.date)}</p>
                        <p><strong>Time:</strong> ${getSafeValue(product.time)}</p>
                    </div>
                `;
            });

            html += `</div>`;
            return html;
        };

        const productPointDetailsPaginationHTML = (page, pageSize, totalCount) => {
            const totalPages = Math.ceil(totalCount / pageSize);
            return `
                <div class='pagination'>
                    <button ${page <= 1 ? 'disabled' : ''} onclick="loadCustomerProductPage(${page - 1})">Previous</button>
                    <span>Page ${page} of ${totalPages}</span>
                    <button ${page >= totalPages ? 'disabled' : ''} onclick="loadCustomerProductPage(${page + 1})">Next</button>
                </div>
            `;
        };

        window.loadCustomerProductPage = function (page) {
            if (page < 1 || page > Math.ceil(productTotalCount / pageSize)) return;
            productCurrentPage = page;
            loadProductData(productCurrentPage);
        };

        loadProductData(productCurrentPage);

        // ===== GIFT POINTS SECTION =====
        let giftCurrentPage = 1;
        let giftTotalCount = 0;

        const loadGiftProductData = (page = 1) => {
            const offset = (page - 1) * pageSize;

            frappe.call({
                method: "reward_management.reward_management.doctype.customer_gift_point_details.customer_gift_point_details.view_gift_point_details",
                args: {
                    docname: frm.doc.name,
                    limit_page_length: pageSize,
                    limit_start: offset
                },
                callback: function (response) {
                    const result = response.message;
                    const giftItems = result.data;
                    giftTotalCount = result.total_count;

                    if (!giftItems) return;

                    let giftHtml = giftPointDetailsCardsHTML(giftItems);
                    giftHtml += giftPointDetailsPaginationHTML(page, pageSize, giftTotalCount);

                    frm.set_df_property("gift_point_history", "options", giftHtml);
                    frm.refresh_field("gift_point_history");
                }
            });
        };

        const giftPointDetailsCardsHTML = (items) => {
            const getSafeValue = val => val !== null && val !== undefined && val !== "" ? val : "&nbsp;";
            let html = `<div class='product-point-grid' style='margin-top:10px'>`;

            items.forEach(gift => {
                html += `
                    <div class='product-point-card'>
                        <p class='d-none unique-id'>${getSafeValue(gift.name)}</p>
                        <p><strong>Customer ID:</strong> ${getSafeValue(gift.customer_id)}</p>
                        <p><strong>Customer Full Name:</strong> ${getSafeValue(gift.customer_full_name)}</p>
                        <p><strong>Gift Product ID:</strong> ${getSafeValue(gift.gift_id)}</p>
                        <p><strong>Gift Product Name:</strong> ${getSafeValue(gift.gift_product_name)}</p>
                        <p><strong>Points Used:</strong> ${getSafeValue(gift.deduct_gift_points)}</p>
                        <p><strong>Date:</strong> ${getSafeValue(gift.date)}</p>
                        <p><strong>Time:</strong> ${getSafeValue(gift.time)}</p>
                    </div>
                `;
            });

            html += `</div>`;
            return html;
        };

        const giftPointDetailsPaginationHTML = (page, pageSize, totalCount) => {
            const totalPages = Math.ceil(totalCount / pageSize);
            return `
                <div class='pagination'>
                    <button ${page <= 1 ? 'disabled' : ''} onclick="loadGiftProductPage(${page - 1})">Previous</button>
                    <span>Page ${page} of ${totalPages}</span>
                    <button ${page >= totalPages ? 'disabled' : ''} onclick="loadGiftProductPage(${page + 1})">Next</button>
                </div>
            `;
        };

        window.loadGiftProductPage = function (page) {
            if (page < 1 || page > Math.ceil(giftTotalCount / pageSize)) return;
            giftCurrentPage = page;
            loadGiftProductData(giftCurrentPage);
        };

        loadGiftProductData(giftCurrentPage);
    }
});
