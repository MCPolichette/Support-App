var fields = {
    attribute_map: [
        {
            name: 'strAttribute1',
            title: 'Parent Group ID',
        },
        {
            name: 'strAttribute2',
            title: 'Color',
        },
        {
            name: 'strAttribute3',
            title: 'Size',
        },
        {
            name: 'strAttribute4',
            title: 'Pattern',
        },
        {
            name: 'strAttribute5',
            title: 'Material',
        },
        {
            name: 'strAttribute6',
            title: 'Age Group',
        },
        {
            name: 'strAttribute7',
            title: 'Gender',
        },
        {
            name: 'strAttribute8',
            title: 'UPC',
        },
        {
            name: 'strAttribute9',
            title: 'Availability',
        },
        {
            name: 'strAttribute10',
            title: 'Google Product Category',
        },
        {
            name: 'strMediumImage',
            title: 'Medium Image URL',
        },
        {
            name: 'txtAttribute1',
            title: 'Variants XML'
        },
        {
            name: 'txtAttribute2',
            title: 'GTIN',
        },
        {
            name: 'txtAttribute3',
            title: 'Key Words',
        },
    ],
    att_map: attributeMap = `<Fields>
                <Field><name>strAttribute1</name><title>Parent Group ID</title><type>string</type></Field>

                <Field><name>strAttribute2</name><title>Color</title><type>string</type></Field>

                <Field><name>strAttribute3</name><title>Size</title><type>string</type></Field>

                <Field><name>strAttribute4</name><title>Pattern</title><type>string</type></Field>

                <Field><name>strAttribute5</name><title>Material</title><type>string</type></Field>

                <Field><name>strAttribute6</name><title>Age Group</title><type>string</type></Field>

                <Field><name>strAttribute7</name><title>Gender</title><type>string</type></Field>

                <Field><name>strAttribute8</name><title>UPC</title><type>string</type></Field>

                <Field><name>strAttribute9</name><title>Availability</title><type>string</type></Field>

                <Field><name>strAttribute10</name><title>Google Product Category</title><type>string</type></Field>

                <Field><name>strMediumImage</name><title>Medium Image URL</title><type>string</type></Field>

                <Field><name>txtAttribute1</name><title>Variants XML</title><type>xml</type><compression>gz</compression></Field>

                <Field><name>txtAttribute2</name><title>GTIN</title><type>string</type></Field>
                <Field><name>txtAttribute3</name><title>Key Words</title><type>string</type></Field>

            </Fields>`,
    required: [{
        field_name: 'strDepartment',
        back_up: ['strAttribute10', 'strCategory', 'strSubCategory']
    }, {
        field_name: "strProductSKU",
        back_up: ['strAttribute1']
    }, {
        field_name: 'strProductName',
        back_up: ['N/A']
    }, {
        field_name: 'dblProductPrice',
        back_up: ['dblProductSalePrice']
    }, {
        field_name: 'strLargeImage',
        back_up: ['strMediumImageURL', 'strThumbnailImageURL']
    }, {
        field_name: 'txtLongDescription',
        back_up: ['txtShortDescription',]
    }, {
        field_name: 'strBuyURL',
        back_up: ['N/A']
    }
    ],
    all: [{
        field_name: 'strDepartment',
        matches: ['department', 'dept'],
        variant: ''
    }, {
        field_name: "strProductSKU",
        matches: ['sku', 'id', 'number', 'idnumber'],
        variant: "strProductSKU"
    }, {
        field_name: 'strProductName',
        matches: ['name', 'title'],
        variant: ''
    }, {
        field_name: 'dblProductPrice',
        matches: ['price', 'retailprice', 'retail'],
        variant: 'variant-retail_price'
    }, {
        field_name: 'strLargeImage',
        matches: ['imageurl', 'image', 'imageurllarge', 'imagelink', 'largeimage', 'largeimagelink,', 'largeimageurl',],
        variant: 'variant-image_url'
    }, {
        field_name: 'txtLongDescription',
        matches: ['longdescription', 'description',],
        variant: ''
    }, {
        field_name: 'strBuyURL',
        matches: ['link', 'buylink', 'buyurl', 'url'],
        variant: 'variant-detail_url'
    }, {
        field_name: 'strCategory',
        matches: ['category', 'standardizedcategorization', 'categorization'],
        variant: ''
    }, {
        field_name: 'strSubCategory',
        matches: ['subcategory'],
        variant: ''
    }, {
        field_name: "strAttribute10",
        matches: ['googlecategory', 'googlecategorization'],
        variant: ''
    }, {
        field_name: 'dblItemCommission',
        matches: ['basedcommission', 'ibc', 'commission', 'commissionrate'],
        variant: ''
    }, {
        field_name: 'dblProductSalePrice',
        matches: ['saleprice', 'sale'],
        variant: 'variant-sale_price'
    }, {
        field_name: 'strManufacturerPartNumber',
        matches: ['manufacturerpartnumber', 'manufacturerid', 'mpn'],
        variant: 'variant-vendor_sku'
    }, {
        field_name: 'strBrandName',
        matches: ['brandname', 'brand'],
        variant: ''
    }, {
        field_name: 'strBrandURL',
        matches: ['brandurl', 'brandpagelink', 'brandpage'],
        variant: ''
    }, {
        field_name: 'strBrandLogoImage',
        matches: ['brandlogoimage', 'brandimage', 'brandimageurl', 'logourl', 'logolink', 'logoimage', 'logourl', 'brandlogo'],
        variant: ''
    }, {
        field_name: 'strThumbnailImage',
        matches: ['thumbnailurl', 'thumbnail', 'thumbnaillink', 'thumbnailimage', 'imageurlsmall', 'imagesmall', 'thumblink', 'thumbimage', 'thumburl'],
        variant: ''
    }, {
        field_name: 'strMediumImage',
        matches: ['mediumimageurl', 'mediumimage', 'mediumimagelink', 'imageurlmedium', 'additionalimagelink', 'additionalimage', 'additionalimageurl'],
        variant: ''
    }, {
        field_name: 'txtShortDescription',
        matches: ['shortdescription'],
        variant: ''
    }, {
        field_name: 'strAttribute1',
        valueTitle: 'Product Parent Grouping Id',
        type: '<type>string</type>',
        matches: ['parentgroup', 'parentgroupid', 'groupid', 'group', 'parentsku', 'parentid'],
        variant: 'variant-sku'
    }, {
        field_name: 'strAttribute2',
        valueTitle: 'Product Color',
        type: '<type>string</type>',
        matches: ['color'],
        variant: 'variant-color'
    }, {
        field_name: 'strAttribute3',
        valueTitle: 'Product Size',
        type: '<type>string</type>',
        matches: ['size',],
        variant: 'variant-size'
    }, {
        field_name: 'strAttribute4',
        valueTitle: 'Product Pattern',
        type: '<type>string</type>',
        matches: ['pattern', 'style'],
        variant: 'variant-style'
    }, {
        field_name: 'strAttribute5',
        valueTitle: 'Product Material',
        type: '<type>string</type>',
        matches: ['material'],
        variant: ''
    }, {
        field_name: 'strAttribute6',
        valueTitle: 'Product Age Group',
        type: '<type>string</type>',
        matches: ['agegroup', 'age'],
        variant: ''
    }, {
        field_name: 'strAttribute7',
        valueTitle: 'Product Gender',
        type: '<type>string</type>',
        matches: ['gender'],
        variant: ''
    }, {
        field_name: 'strAttribute8',
        valueTitle: 'Product UPC',
        type: '<type>string</type>',
        matches: ['upc', 'upc/gtin'],
        variant: 'variant-upc'
    }, {
        field_name: 'strAttribute9',
        valueTitle: 'Product Availability',
        type: '<type>string</type>',
        matches: ['availability', 'available'],
        variant: ''
    }, {
        field_name: 'txtAttribute1',
        valueTitle: 'Variants XML',
        type: '<type>xml</type><compression>gz</compression>',
        matches: ['xml', 'variantxml', 'variants', 'variantsxml', 's', 'sxml'],
        variant: ''
    }, {
        field_name: 'txtAttribute2',
        valueTitle: 'GTIN',
        type: '<type>string</type>',
        matches: ['gtin', 'gtin/upc'],
        variant: ''
    }, {
        field_name: 'txtAttribute3',
        valueTitle: 'Key Words',
        type: '<type>string</type>',
        matches: ['keywords'],
        variant: ''
    }],
    variants: [{
        variant: 'variant-sku',
        matches: 'sku'
    },
    {
        variant: 'variant-upc',
        matches: 'upc'
    },
    {
        variant: 'variant-vendor_sku',
        matches: 'vendorsku'
    },
    {
        variant: 'variant-size',
        matches: 'size'
    },
    {
        variant: 'variant-color',
        matches: 'color'
    },
    {
        variant: 'Variant-style',
        matches: 'style'
    },
    {
        variant: 'Variant-retail_price',
        matches: 'retailprice'
    },
    {
        variant: 'Variant-sale_price',
        matches: 'saleprice'
    },
    {
        variant: 'variant-image_url',
        matches: 'imageurl'
    },
    {
        variant: 'variant-detail_url',
        matches: 'detailurl'
    },
    {
        variant: 'variant-action_url',
        matches: 'actionurl'
    },
    {
        variant: 'variant-available',
        matches: 'available'
    },
    {
        variant: 'variant-season',
        matches: 'season'
    },
    {
        variant: 'variant-vendor_sku',
        matches: 'vendorsku'
    },
    {
        variant: 'Variant-year',
        matches: 'year'
    },],
}