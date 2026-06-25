# Asa Fabric Website

Premium front-end concept for Asa Fabric, a textile stock house selling fabrics such as TC, wool blend, poly cotton, chambray, twill, shirting, trousering, and clearance dead stock.

## Current version

This first version is a static website prototype focused on the sales funnel:

- premium landing page for Asa Fabric
- catalog cards for fabric lots
- filters by use case such as school uniforms, corporate wear, workwear, and resale deals
- roll price and cut-length price presentation
- enquiry form layout for buyer leads
- responsive desktop and mobile design

The inventory values are sample placeholders based on the business requirements. They should be replaced with the real stock data from the Google Sheet once access and data structure are finalized.

## Files

- `index.html` - page structure and content
- `styles.css` - responsive visual design and textile treatments
- `app.js` - sample catalog data, use-case rendering, search, and filters
- `catalog.html` - dedicated full-catalog page scaffold (catalog workstream)

## Next steps

1. Build out `catalog.html` into the full searchable catalog (owned by the catalog workstream). The landing page deep-links to it via fabric-type slugs like `catalog.html#shirtings`.
2. Wire the landing-page hero, fabric-type cards, and featured preview to the same data source as the catalog page so they stay in sync.
3. Connect the catalog data to the real stock sheet or an exported CSV/JSON file.
4. Add real fabric photos for each lot.
5. Replace placeholder prices with confirmed roll and cut-length pricing.
6. Decide how enquiries should be handled: WhatsApp, email, form backend, or CRM.
