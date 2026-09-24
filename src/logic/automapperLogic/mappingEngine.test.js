import autoMapHeaders, { assignField } from "./mappingEngine";
import fieldAliases from "./fieldAliases.json";

const map = (headers, rows) => autoMapHeaders(headers, rows).mapped;

test("regular and discounted prices stay separate", () => {
    expect(map(["price", "sale_price"], [{ price: 20, sale_price: 15 }]).map(row => row.fieldName))
        .toEqual(["dblProductPrice", "dblProductSalePrice"]);
});

test("header strength beats position and fill percentage among populated columns", () => {
    const rows = map(["retail_price", "price"], [{ retail_price: 20, price: 25 }, { retail_price: 20, price: "" }]);
    expect(rows[0].fieldName).toBe("");
    expect(rows[1].fieldName).toBe("dblProductPrice");
    expect(rows[1].assignmentNote.description).toContain("stronger header match");
});

test("a populated column beats an empty stronger header", () => {
    const rows = map(["price", "retailprice"], [{ price: "", retailprice: 20 }]);
    expect(rows[1].fieldName).toBe("dblProductPrice");
    expect(rows[1].assignmentNote.description).toContain("contained data");
});

test.each([
    [["saleprice"], [{ saleprice: 15 }]],
    [["price", "saleprice"], [{ price: "", saleprice: 15 }]],
])("sale price fills missing or empty regular price with a note", (headers, data) => {
    const rows = map(headers, data);
    const price = rows.find(row => row.fieldName === "dblProductPrice");
    expect(price.header).toBe("saleprice");
    expect(price.required).toBe(true);
    expect(price.variant).toBe("variant-retail_price");
    expect(price.assignmentNote.title).toBe("Sale price used as Price");
    expect(rows.some(row => row.fieldName === "dblProductSalePrice")).toBe(false);
});

test("an empty sale column cannot satisfy required Price", () => {
    expect(autoMapHeaders(["saleprice"], [{ saleprice: "" }]).requiredWarnings)
        .toEqual(expect.arrayContaining([expect.objectContaining({ fieldName: "dblProductPrice" })]));
});

test("manual mapping preserves the existing assignment until explicitly cleared", () => {
    const rows = map(["price", "retailprice"], [{ price: 20, retailprice: 20 }]);
    expect(assignField(rows, 1, "dblProductPrice")).toBe(rows);
    const cleared = assignField(rows, 0, "");
    expect(assignField(cleared, 1, "dblProductPrice").map(row => row.fieldName)).toEqual(["", "dblProductPrice"]);
});

test("all known aliases produce unique assignments", () => {
    const headers = fieldAliases.flatMap(field => field.matches || []);
    const rows = map(headers, [Object.fromEntries(headers.map(header => [header, "10"]))]);
    const assigned = rows.filter(row => row.fieldName).map(row => row.fieldName);
    expect(new Set(assigned).size).toBe(assigned.length);
});
