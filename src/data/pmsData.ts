import type { PMSProvider } from '../types';

export const pmsProviders: PMSProvider[] = [
  {
    name: "Mews",
    mappings: [
      {
        endpointName: "searchReservation",
        pmsApiUrl: "api/connector/v1/reservations/getAll/2023-06-06",
        responseName: "Reservations",
        keyPmsVariables: "Id, ServiceId, RateId, RequestedResourceCategoryId, BusinessSegmentId, AccountId, AssignedResourceId",
        outputFieldMapping: "fileId ← Id, reservationId ← Id, guest.companyId ← Company lookup, state ← status",
        additionalNotes: "Requires additional API calls for orderItems, customers, rates, resourceCategories",
        pmsSampleResponse: `{"Reservations": [{"Id": "RSV-123", "ServiceId": "SVC-001", "RateId": "RATE-789", "RequestedResourceCategoryId": "RC-001", "BusinessSegmentId": "SEG-001", "AccountId": "CUST-456", "AssignedResourceId": "RES-101", "StartUtc": "2024-01-15T14:00:00Z", "EndUtc": "2024-01-17T11:00:00Z", "State": "Confirmed", "Purpose": "Vacation", "PersonCounts": [{"AgeCategoryId": "ADT", "Count": 2}], "CreatedUtc": "2024-01-10T10:00:00Z", "UpdatedUtc": "2024-01-12T15:30:00Z"}], "Cursor": null}`,
        functionOutputPayload: `{"reservations": {"2024-01-15": [{"fileId": "RSV-123", //reservation.Id
"yourRefId": "",
"guest": {"companyId": "", "contactId": "CUST-456"}, //reservation.AccountId
"state": "Confirmed", //reservation.State
"marketing": {"source": "Booking.com", //sourceData mapping
"segment": "Leisure", //businessSegments mapping
"channel": ""},
"purpose": "Vacation", //reservation.Purpose
"reservationId": "RSV-123", //reservation.Id
"roomTypes": [{"roomTypeCode": "RC-001", //reservation.RequestedResourceCategoryId
"roomTypeLabel": "Deluxe Room", //resourceCategories.Names
"ratePlanCode": "RATE-789", //reservation.RateId
"ratePlanLabel": "Best Available Rate", //rates.Name
"amountAfterTax": 120.50, //calculated from orderItems
"taxValue": 15.50, //calculated from orderItems
"numberOfRooms": 1,
"guestCount": [{"ageCategoryId": "ADT", "numberOfGuest": 2}], //reservation.PersonCounts
"pmsFields": {"serviceIds": "SVC-001", //reservation.ServiceId
"guest": {"id": "CUST-456", //reservation.AccountId
"name": "John", //customer.FirstName
"surname": "Doe", //customer.LastName
"email": "john.doe@email.com", //customer.Email
"phone": "+1234567890", //customer.Phone
"address": {"street": "123 Main St", //customer.Address.Line1
"city": "New York", //customer.Address.City
"country": "US", //customer.Address.CountryCode
"zip": "10001"}}, //customer.Address.PostalCode
"roomCode": "RM-101", //reservation.AssignedResourceId
"roomCodeLabel": "Room 101", //assignedResourcesData.Name
"startUtc": "2024-01-15T14:00:00Z", //reservation.StartUtc
"endUtc": "2024-01-17T11:00:00Z"}, //reservation.EndUtc
"orderItems": [{"name": "Room Charge", //orderItems.BillingName
"type": "ACCOMMODATION",
"amountAfterTax": 100.00, //orderItems.OriginalAmount.GrossValue
"taxValue": 12.00, //calculated from orderItems
"count": 1}]}], //orderItems.UnitCount
"createdAt": "2024-01-10T10:00:00Z", //reservation.CreatedUtc
"updatedAt": "2024-01-12T15:30:00Z"}]}} //reservation.UpdatedUtc`
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "api/connector/v1/ageCategories/getAll",
        responseName: "AgeCategories",
        keyPmsVariables: "Age category objects with Id, Name, age ranges",
        outputFieldMapping: "ageCategory ← age category mapping",
        additionalNotes: "Used for guest count categorization",
        pmsSampleResponse: `{"AgeCategories": [{"Id": "ADT", "Names": {"en-US": "Adult"}, "MinimalAge": 18, "MaximalAge": 100}, {"Id": "CHD", "Names": {"en-US": "Child"}, "MinimalAge": 3, "MaximalAge": 17}, {"Id": "INF", "Names": {"en-US": "Infant"}, "MinimalAge": 0, "MaximalAge": 2}]}`,
        functionOutputPayload: "Part of searchReservation response above"
      },
      {
        endpointName: "getBlockedResources",
        pmsApiUrl: "api/connector/v1/services/getAll",
        responseName: "Services",
        keyPmsVariables: "Id, Name",
        outputFieldMapping: "serviceIds ← Service mapping",
        additionalNotes: "Base service information",
        pmsSampleResponse: `{"Services": [{"Id": "SVC-001", "Name": "Accommodation", "IsActive": true}, {"Id": "SVC-002", "Name": "F&B", "IsActive": true}]}`,
        functionOutputPayload: `[{"resourceId": "RES-101", //resourceBlock.AssignedResourceId
"name": "Maintenance Block", //resourceBlock.Name
"startDate": "2024-01-15T00:00:00Z", //resourceBlock.StartUtc
"endDate": "2024-01-16T00:00:00Z", //resourceBlock.EndUtc
"type": "Maintenance", //resourceBlock.Type
"description": "Room maintenance work", //resourceBlock.Notes
"categoryId": "RC-001"}, //resourceCategoryMap lookup
{"resourceId": "RES-102",
"name": "Event Block",
"startDate": "2024-01-20T00:00:00Z",
"endDate": "2024-01-22T00:00:00Z",
"type": "Event",
"description": "Corporate event booking",
"categoryId": "RC-002"}]`
      },
      {
        endpointName: "getBlockedResources",
        pmsApiUrl: "api/connector/v1/resourceCategories/getAll",
        responseName: "ResourceCategories",
        keyPmsVariables: "Id, Name",
        outputFieldMapping: "Resource category structure",
        additionalNotes: "Resource type definitions",
        pmsSampleResponse: `{"ResourceCategories": [{"Id": "RC-001", "Names": {"en-US": "Standard Room"}, "Capacity": 2, "Type": "Room", "IsActive": true}, {"Id": "RC-002", "Names": {"en-US": "Suite"}, "Capacity": 4, "Type": "Suite", "IsActive": true}]}`,
        functionOutputPayload: "Part of getBlockedResources response above"
      },
      {
        endpointName: "getBlockedResources",
        pmsApiUrl: "api/connector/v1/resourceBlocks/getAll",
        responseName: "ResourceBlocks",
        keyPmsVariables: "Id, AssignedResourceId, Name, StartUtc, EndUtc, Type, Notes",
        outputFieldMapping: "Blocked periods with date ranges",
        additionalNotes: "Date-filtered resource availability",
        pmsSampleResponse: `{"ResourceBlocks": [{"Id": "BLK-001", "AssignedResourceId": "RES-101", "Name": "Maintenance Block", "StartUtc": "2024-01-15T00:00:00Z", "EndUtc": "2024-01-16T00:00:00Z", "Type": "Maintenance", "Notes": "Room maintenance work"}, {"Id": "BLK-002", "AssignedResourceId": "RES-102", "Name": "Event Block", "StartUtc": "2024-01-20T00:00:00Z", "EndUtc": "2024-01-22T00:00:00Z", "Type": "Event", "Notes": "Corporate event booking"}]}`,
        functionOutputPayload: "Part of getBlockedResources response above"
      },
      {
        endpointName: "getBlockedResources",
        pmsApiUrl: "api/connector/v1/resourceCategoryAssignments/getAll",
        responseName: "ResourceCategoryAssignments",
        keyPmsVariables: "Id, ResourceId, CategoryId",
        outputFieldMapping: "Resource-to-category relationships",
        additionalNotes: "Links resources to categories",
        pmsSampleResponse: `{"ResourceCategoryAssignments": [{"Id": "RCA-001", "ResourceId": "RES-101", "CategoryId": "RC-001"}, {"Id": "RCA-002", "ResourceId": "RES-102", "CategoryId": "RC-002"}]}`,
        functionOutputPayload: "Part of getBlockedResources response above"
      },
      {
        endpointName: "updateInventory",
        pmsApiUrl: "api/connector/v1/rates/updatePrice",
        responseName: "UpdateInventory",
        keyPmsVariables: "Rate update response",
        outputFieldMapping: "Price update confirmation",
        additionalNotes: "Updates pricing in PMS system",
        pmsSampleResponse: `{"Success": true, "UpdatedRateIds": ["RATE-001", "RATE-002"], "Errors": []}`,
        functionOutputPayload: `{"success": true, "message": "Inventory updated successfully", "updatedRates": 15} //Response from PMS rate update operation`
      },
      {
        endpointName: "getHotelInfo",
        pmsApiUrl: "api/connector/v1/configuration/get",
        responseName: "Configuration",
        keyPmsVariables: "Enterprise, Id, Name, DefaultLanguageCode, Currencies, Email, Phone, TimeZoneIdentifier, Address",
        outputFieldMapping: "hotelCode ← Enterprise.Id, name ← Enterprise.Name, language ← Enterprise.DefaultLanguageCode",
        additionalNotes: "Primary hotel configuration data",
        pmsSampleResponse: `{"Enterprise": {"Id": "851df8c8-90f2-4c4a-8e01-a4fc46b25178", "Name": "Connector API Hotel", "DefaultLanguageCode": "en-US", "Currencies": [{"Currency": "USD", "IsDefault": true}, {"Currency": "EUR", "IsDefault": false}], "Email": "info@hotel.com", "Phone": "+1234567890", "TimeZoneIdentifier": "America/New_York", "Address": {"Line1": "123 Hotel Street", "Line2": "Suite 100", "City": "New York", "PostalCode": "10001", "CountryCode": "US"}}}`,
        functionOutputPayload: `{"hotel": {"hotelCode": "851df8c8-90f2-4c4a-8e01-a4fc46b25178", //hotelInfo.Enterprise.Id
"name": "Connector API Hotel", //hotelInfo.Enterprise.Name
"language": "en-US", //hotelInfo.Enterprise.DefaultLanguageCode
"currency": "USD", //hotelInfo.Enterprise.Currencies[IsDefault]
"isActive": true,
"cityTaxCode": "TAX-001", //taxes.TaxRates[0].Code
"email": "info@hotel.com", //hotelInfo.Enterprise.Email
"phone": "+1234567890", //hotelInfo.Enterprise.Phone
"timezone": "America/New_York", //hotelInfo.Enterprise.TimeZoneIdentifier
"address": {"address1": "123 Hotel Street", //hotelInfo.Enterprise.Address.Line1
"address2": "Suite 100", //hotelInfo.Enterprise.Address.Line2
"city": "New York", //hotelInfo.Enterprise.Address.City
"zipCode": "10001", //hotelInfo.Enterprise.Address.PostalCode
"country": "US", //hotelInfo.Enterprise.Address.CountryCode
"email": "info@hotel.com",
"phone": "+1234567890"}},
"additionalInfo": {"taxes": [{"code": "TAX-001", //tax.Code
"name": "City Tax", //taxation.Name
"value": 5.5}], //tax.Value
"businessSegments": [{"id": "SEG-001", //segment.Id
"name": "Leisure"}]}}} //segment.Name`
      },
      {
        endpointName: "getHotelInfo",
        pmsApiUrl: "api/connector/v1/taxations/getAll",
        responseName: "Taxes",
        keyPmsVariables: "TaxRates, Taxations, Code, TaxationCode, Value, Name",
        outputFieldMapping: "Tax configuration for property",
        additionalNotes: "Tax rates and taxation definitions",
        pmsSampleResponse: `{"TaxRates": [{"Code": "TAX-001", "TaxationCode": "CITY", "Value": 5.5}, {"Code": "TAX-002", "TaxationCode": "VAT", "Value": 21.0}], "Taxations": [{"Code": "CITY", "Name": "City Tax"}, {"Code": "VAT", "Name": "Value Added Tax"}]}`,
        functionOutputPayload: "Part of getHotelInfo response above"
      },
      {
        endpointName: "getHotelInfo",
        pmsApiUrl: "api/connector/v1/businessSegments/getAll",
        responseName: "BusinessSegments",
        keyPmsVariables: "Id, Name",
        outputFieldMapping: "Business segment definitions",
        additionalNotes: "Market segment categorization",
        pmsSampleResponse: `{"BusinessSegments": [{"Id": "SEG-001", "Name": "Leisure"}, {"Id": "SEG-002", "Name": "Business"}, {"Id": "SEG-003", "Name": "Group"}]}`,
        functionOutputPayload: "Part of getHotelInfo response above"
      },
      {
        endpointName: "getCompany",
        pmsApiUrl: "api/connector/v1/companies/getAll",
        responseName: "Companies",
        keyPmsVariables: "Id, Name, IsActive, InvoicingEmail, Telephone, Address, TaxIdentifier, RegistrationNumber",
        outputFieldMapping: "id ← Id, name ← Name, email ← InvoicingEmail, phone ← Telephone, siretNumber ← RegistrationNumber, vatNumber ← TaxIdentifier",
        additionalNotes: "Company/corporate client information",
        pmsSampleResponse: `{"Companies": [{"Id": "COMP-123", "Name": "ABC Corporation", "IsActive": true, "InvoicingEmail": "billing@abccorp.com", "Telephone": "+33123456789", "Address": {"Line1": "123 Business Ave", "Line2": "", "City": "Paris", "PostalCode": "75001", "CountryCode": "FR"}, "TaxIdentifier": "FR12345678901", "RegistrationNumber": "12345678901234"}, {"Id": "COMP-456", "Name": "XYZ Ltd", "IsActive": true, "InvoicingEmail": "accounts@xyzltd.com", "Telephone": "+44207123456", "Address": {"Line1": "456 Corporate Blvd", "Line2": "", "City": "London", "PostalCode": "SW1A 1AA", "CountryCode": "GB"}, "TaxIdentifier": "GB987654321", "RegistrationNumber": "98765432109876"}]}`,
        functionOutputPayload: `[{"id": "COMP-123", //company.Id
"isActive": true, //company.IsActive
"siretNumber": "12345678901234", //company.RegistrationNumber
"vatNumber": "FR12345678901", //company.TaxIdentifier
"name": "ABC Corporation", //company.Name
"email": "billing@abccorp.com", //company.InvoicingEmail
"phone": "+33123456789", //company.Telephone
"address": {"street": "123 Business Ave", //company.Address.Line1+Line2
"city": "Paris", //company.Address.City
"country": "FR", //company.Address.CountryCode
"zip": "75001"}}, //company.Address.PostalCode
{"id": "COMP-456",
"isActive": true,
"siretNumber": "98765432109876",
"vatNumber": "GB987654321",
"name": "XYZ Ltd",
"email": "accounts@xyzltd.com",
"phone": "+44207123456",
"address": {"street": "456 Corporate Blvd",
"city": "London",
"country": "GB",
"zip": "SW1A 1AA"}}]`
      },
      {
        endpointName: "getProducts",
        pmsApiUrl: "api/connector/v1/services/getAll",
        responseName: "Services",
        keyPmsVariables: "Id, Name, Data.Discriminator, IsActive",
        outputFieldMapping: "Service definitions",
        additionalNotes: "Base service catalog",
        pmsSampleResponse: `{"Services": [{"Id": "SVC-001", "Name": "Accommodation", "Data": {"Discriminator": "Accommodation"}, "IsActive": true}, {"Id": "SVC-002", "Name": "F&B", "Data": {"Discriminator": "Extra"}, "IsActive": true}]}`,
        functionOutputPayload: `{"products": [{"productCode": "PROD-001", //product.Id
"productLabel": "Room Service Breakfast", //product.Names[defaultKey]
"productShortLabel": "Breakfast", //product.ShortNames[defaultKey]
"accountingCategory": {"classification": "Revenue", //accountingCategory.Classification
"name": "Food & Beverage", //accountingCategory.Name
"code": "FB001"}, //accountingCategory.Code
"serviceId": "SVC-001", //product.ServiceId
"serviceType": "Accommodation", //service.Data.Discriminator
"price": 25.00, //product.Price.GrossValue
"tax": {"taxCode": "VAT", //product.Price.TaxValues[0].Code
"taxValue": 5.0}, //product.Price.TaxValues[0].Value
"isActive": true, //product.IsActive
"chargingMode": "PerPerson"}, //product.ChargingMode
{"productCode": "PROD-002",
"productLabel": "Spa Package",
"productShortLabel": "Spa",
"accountingCategory": {"classification": "Revenue",
"name": "Wellness",
"code": "SPA001"},
"serviceId": "SVC-002",
"serviceType": "Extra",
"price": 120.00,
"tax": {"taxCode": "VAT",
"taxValue": 20.0},
"isActive": true,
"chargingMode": "PerService"}],
"totalCount": 2}`
      },
      {
        endpointName: "getProducts",
        pmsApiUrl: "api/connector/v1/products/getAll",
        responseName: "Products",
        keyPmsVariables: "Product objects with service associations",
        outputFieldMapping: "Product catalog with service links",
        additionalNotes: "Hotel products and amenities",
        pmsSampleResponse: `{"Products": [{"Id": "PROD-001", "Names": {"en-US": "Room Service Breakfast"}, "ShortNames": {"en-US": "Breakfast"}, "ServiceId": "SVC-001", "AccountingCategoryId": "AC-001", "Price": {"GrossValue": 25.00, "TaxValues": [{"Code": "VAT", "Value": 5.0}]}, "IsActive": true, "ChargingMode": "PerPerson"}, {"Id": "PROD-002", "Names": {"en-US": "Spa Package"}, "ShortNames": {"en-US": "Spa"}, "ServiceId": "SVC-002", "AccountingCategoryId": "AC-002", "Price": {"GrossValue": 120.00, "TaxValues": [{"Code": "VAT", "Value": 20.0}]}, "IsActive": true, "ChargingMode": "PerService"}]}`,
        functionOutputPayload: "Part of getProducts response above"
      },
      {
        endpointName: "getProducts",
        pmsApiUrl: "api/connector/v1/accountingCategories/getAll",
        responseName: "AccountingCategories",
        keyPmsVariables: "Accounting category objects",
        outputFieldMapping: "Financial categorization",
        additionalNotes: "Revenue accounting setup",
        pmsSampleResponse: `{"AccountingCategories": [{"Id": "AC-001", "Classification": "Revenue", "Name": "Food & Beverage", "Code": "FB001"}, {"Id": "AC-002", "Classification": "Revenue", "Name": "Wellness", "Code": "SPA001"}]}`,
        functionOutputPayload: "Part of getProducts response above"
      },
      {
        endpointName: "searchContact",
        pmsApiUrl: "api/connector/v1/customers/getAll",
        responseName: "Customers",
        keyPmsVariables: "Id, Title, FirstName, LastName, Email, Phone, Address, NationalityCode, Sex, BirthDate",
        outputFieldMapping: "id ← Id, name ← FirstName, surname ← LastName, email ← Email, phone ← Phone, address ← Address mapping",
        additionalNotes: "Guest/customer profile information",
        pmsSampleResponse: `{"Customers": [{"Id": "CUST-001", "Title": "Mr.", "FirstName": "John", "LastName": "Smith", "SecondLastName": "", "NationalityCode": "US", "Sex": "Male", "BirthDate": "1985-03-15", "BirthPlace": "New York", "Occupation": "Engineer", "Email": "john.smith@email.com", "Phone": "+1234567890", "LoyaltyCode": "GOLD123", "Notes": "VIP guest", "CarRegistrationNumber": "ABC-123", "DietaryRequirements": "Vegetarian", "TaxIdentificationNumber": "123-45-6789", "CompanyId": "COMP-001", "Address": {"Line1": "123 Main Street", "Line2": "Apt 4B", "City": "New York", "PostalCode": "10001", "CountryCode": "US"}, "IdentityCard": "ID123456", "DriversLicense": "DL7890123", "Passport": null, "Visa": null, "Classifications": [], "Options": [], "ChainId": "CHAIN-001", "ItalianDestinationCode": "", "ItalianFiscalCode": ""}]}`,
        functionOutputPayload: `[{"id": "CUST-001", //customer.Id
"title": "Mr.", //customer.Title
"name": "John", //customer.FirstName
"surname": "Smith", //customer.LastName
"secondSurname": "", //customer.SecondLastName
"nationality": "US", //customer.NationalityCode
"sex": "Male", //customer.Sex
"birthDate": "1985-03-15", //customer.BirthDate
"birthPlace": "New York", //customer.BirthPlace
"occupation": "Engineer", //customer.Occupation
"email": "john.smith@email.com", //customer.Email
"phone": "+1234567890", //customer.Phone
"loyaltyCode": "GOLD123", //customer.LoyaltyCode
"notes": "VIP guest", //customer.Notes
"carRegistrationNumber": "ABC-123", //customer.CarRegistrationNumber
"dietaryRequirements": "Vegetarian", //customer.DietaryRequirements
"taxIdentificationNumber": "123-45-6789", //customer.TaxIdentificationNumber
"companyId": "COMP-001", //customer.CompanyId
"address": {"address1": "123 Main Street", //customer.Address.Line1
"address2": "Apt 4B", //customer.Address.Line2
"city": "New York", //customer.Address.City
"zipCode": "10001", //customer.Address.PostalCode
"country": "US"}, //customer.Address.CountryCode
"identityCard": "ID123456", //customer.IdentityCard
"driversLicense": "DL7890123", //customer.DriversLicense
"passport": null, //customer.Passport
"visa": null, //customer.Visa
"classifications": [], //customer.Classifications
"options": [], //customer.Options
"chainId": "CHAIN-001", //customer.ChainId
"italianDestinationCode": "", //customer.ItalianDestinationCode
"italianFiscalCode": ""}] //customer.ItalianFiscalCode`
      },
      {
        endpointName: "getRates",
        pmsApiUrl: "api/connector/v1/services/getAll",
        responseName: "Services",
        keyPmsVariables: "Service objects with Id, Name",
        outputFieldMapping: "Service-rate associations",
        additionalNotes: "Services linked to rates",
        pmsSampleResponse: `{"Services": [{"Id": "SVC-001", "Name": "Accommodation", "IsActive": true}, {"Id": "SVC-002", "Name": "F&B", "IsActive": true}]}`,
        functionOutputPayload: `[{"rateCode": "RATE-001", //rate.Id
"rateLabel": "Best Available Rate", //rate.Name
"rateShortLabel": "BAR", //rate.ShortName
"priceType": "Accommodation", //serviceMap[rate.ServiceId]
"isActive": true, //rate.IsActive
"isEnabled": true, //rate.IsEnabled
"isPublic": true}, //rate.IsPublic
{"rateCode": "RATE-002",
"rateLabel": "Corporate Rate",
"rateShortLabel": "CORP",
"priceType": "Accommodation",
"isActive": true,
"isEnabled": true,
"isPublic": false}]`
      },
      {
        endpointName: "getRates",
        pmsApiUrl: "api/connector/v1/rates/getAll",
        responseName: "Rates",
        keyPmsVariables: "Rate objects with service associations",
        outputFieldMapping: "Rate definitions and pricing",
        additionalNotes: "Room rates and pricing structures",
        pmsSampleResponse: `{"Rates": [{"Id": "RATE-001", "Name": "Best Available Rate", "ShortName": "BAR", "ServiceId": "SVC-001", "IsActive": true, "IsEnabled": true, "IsPublic": true}, {"Id": "RATE-002", "Name": "Corporate Rate", "ShortName": "CORP", "ServiceId": "SVC-001", "IsActive": true, "IsEnabled": true, "IsPublic": false}]}`,
        functionOutputPayload: "Part of getRates response above"
      },
      {
        endpointName: "getResourceCategory",
        pmsApiUrl: "api/connector/v1/services/getAll",
        responseName: "Services",
        keyPmsVariables: "Service data",
        outputFieldMapping: "Service definitions",
        additionalNotes: "Base services for resource categories",
        pmsSampleResponse: `{"Services": [{"Id": "SVC-001", "Name": "Accommodation", "IsActive": true}]}`,
        functionOutputPayload: `{"resourceTypes": [{"resourceLabel": "Standard Room", //resourceCategory.Names[key]
"resourceCode": "RC-001", //resourceCategory.Id
"minOccupancy": 1,
"maxOccupancy": 2, //resourceCategory.Capacity
"resourceType": "Room", //resourceCategory.Type
"isActive": true, //resourceCategory.IsActive
"slots": {},
"pmsFields": {"serviceIds": "SVC-001", //resourceCategory.EnterpriseId
"ageCategory": {},
"resources": [{
"label": "Room 101", //resource.Name
"parent": null, //resource.ParentResourceId
"state": "Active", //resource.State
"id": "RES-101"}]}}, //resource.Id
{"resourceLabel": "Deluxe Suite",
"resourceCode": "RC-002",
"minOccupancy": 1,
"maxOccupancy": 4,
"resourceType": "Suite",
"isActive": true,
"slots": {},
"pmsFields": {"serviceIds": "SVC-001",
"ageCategory": {},
"resources": [{
"label": "Suite 201",
"parent": null,
"state": "Active",
"id": "RES-201"},
{"label": "Suite 202",
"parent": null,
"state": "Active",
"id": "RES-202"}]}}]}`
      },
      {
        endpointName: "getResourceCategory",
        pmsApiUrl: "api/connector/v1/resourceCategories/getAll",
        responseName: "ResourceCategories",
        keyPmsVariables: "Id, Names, Capacity, Type, IsActive",
        outputFieldMapping: "resourceLabel ← Names[key], resourceCode ← Id, maxOccupancy ← Capacity, resourceType ← Type",
        additionalNotes: "Room types and resource definitions",
        pmsSampleResponse: `{"ResourceCategories": [{"Id": "RC-001", "Names": {"en-US": "Standard Room"}, "Capacity": 2, "Type": "Room", "IsActive": true, "EnterpriseId": "SVC-001"}, {"Id": "RC-002", "Names": {"en-US": "Deluxe Suite"}, "Capacity": 4, "Type": "Suite", "IsActive": true, "EnterpriseId": "SVC-001"}]}`,
        functionOutputPayload: "Part of getResourceCategory response above"
      },
      {
        endpointName: "getResourceCategory",
        pmsApiUrl: "api/connector/v1/resources/getAll",
        responseName: "Resources",
        keyPmsVariables: "Id, Name, ParentResourceId, State",
        outputFieldMapping: "Individual resource details",
        additionalNotes: "Specific rooms/resources",
        pmsSampleResponse: `{"Resources": [{"Id": "RES-101", "Name": "Room 101", "ParentResourceId": null, "State": "Active"}, {"Id": "RES-201", "Name": "Suite 201", "ParentResourceId": null, "State": "Active"}, {"Id": "RES-202", "Name": "Suite 202", "ParentResourceId": null, "State": "Active"}]}`,
        functionOutputPayload: "Part of getResourceCategory response above"
      },
      {
        endpointName: "getResourceCategory",
        pmsApiUrl: "api/connector/v1/resourceCategoryAssignments/getAll",
        responseName: "ResourceCategoryAssignments",
        keyPmsVariables: "CategoryId, ResourceId",
        outputFieldMapping: "Resource assignment to categories",
        additionalNotes: "Links specific resources to room types",
        pmsSampleResponse: `{"ResourceCategoryAssignments": [{"Id": "RCA-001", "CategoryId": "RC-001", "ResourceId": "RES-101"}, {"Id": "RCA-002", "CategoryId": "RC-002", "ResourceId": "RES-201"}, {"Id": "RCA-003", "CategoryId": "RC-002", "ResourceId": "RES-202"}]}`,
        functionOutputPayload: "Part of getResourceCategory response above"
      }
    ]
  },
  {
    name: "Thais",
    mappings: [
      {
        endpointName: "searchReservation",
        pmsApiUrl: "hub/api/partner/hotel/age-ranges",
        responseName: "ageRanges",
        keyPmsVariables: "Age range mapping objects with id, mapping_key",
        outputFieldMapping: "Age category definitions for guest count",
        additionalNotes: "Provides age categorization for guests",
        pmsSampleResponse: `[{"id": 1, "mapping_key": "adults", "age": 18}, {"id": 2, "mapping_key": "children", "age": 3}, {"id": 3, "mapping_key": "infants", "age": 0}]`,
        functionOutputPayload: `{"reservations": {"2024-01-15": [{"fileId": "GRP-123", //reservation.booking_group_id
"yourRefId": "REF-456", //reservation.reference
"guest": {"companyId": "", "contactId": ""},
"state": "checkin checkout", //booking_rooms states combined
"marketing": {"source": "Direct", //reservation.source
"segment": "",
"channel": "Website"}, //reservation.booking_origin.label
"purpose": "Leisure", //reservation.booking_reason.label
"reservationId": "789", //reservation.id
"roomTypes": [{"roomTypeCode": "101", //booking_room.room.room_type_id
"roomTypeLabel": "Standard Room", //booking_room.room.room_type.label
"ratePlanCode": "RATE-001", //booking_room.rate.id
"ratePlanLabel": "Standard Rate", //booking_room.rate.label
"amountAfterTax": 150.00, //booking_room.total_incl_taxes_extras
"taxPercent": 10.0, //booking_room.rate.vat_rate.vat_rate
"numberOfRooms": 1,
"guestCount": [{"ageCategoryId": "1", "numberOfGuest": 2}],
"pmsFields": {"guest": {"id": "CUST-789", //reservation.customer.id
"name": "Jane", //reservation.customer.firstname
"surname": "Smith", //reservation.customer.lastname
"email": "jane.smith@email.com", //reservation.customer.email
"phone": "+1987654321", //reservation.customer.phone
"address": {"street": "456 Oak St", //reservation.customer.address
"city": "Boston", //reservation.customer.city
"country": "US", //reservation.customer.country_iso2
"zip": "02101"}}, //reservation.customer.postcode
"roomCode": "12345", //booking_room.room_id
"roomCodeLabel": "Room 105"}, //booking_room.room.label
"orderItems": [{"name": "Room Charge",
"type": "ACCOMMODATION",
"amountAfterTax": 150.00,
"count": 1}]}],
"createdAt": "2024-01-10T08:00:00Z", //reservation.created_at
"updatedAt": "2024-01-12T10:00:00Z"}]}} //reservation.updated_at`
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "hub/api/partner/hotel/bookings",
        responseName: "bookings",
        keyPmsVariables: "Booking objects with customer, booking_rooms, dates",
        outputFieldMapping: "Reservation data transformation",
        additionalNotes: "Query params: start_at, end_at, updated_since, booking_id",
        pmsSampleResponse: `[{"id": 789, "booking_group_id": "GRP-123", "reference": "REF-456", "customer": {"id": "CUST-789", "firstname": "Jane", "lastname": "Smith", "email": "jane.smith@email.com", "phone": "+1987654321", "address": "456 Oak St", "city": "Boston", "country_iso2": "US", "postcode": "02101"}, "booking_rooms": [{"id": 1, "room_id": 12345, "room": {"id": 12345, "label": "Room 105", "room_type_id": 101, "room_type": {"label": "Standard Room", "nb_persons_min": 1, "nb_persons_max": 2}}, "rate": {"id": "RATE-001", "label": "Standard Rate", "vat_rate": {"vat_rate": 10.0}}, "total_incl_taxes_extras": 150.00, "state": "checkin"}], "source": "Direct", "booking_origin": {"label": "Website"}, "booking_reason": {"label": "Leisure"}, "arrival_date": "2024-01-15", "departure_date": "2024-01-17", "created_at": "2024-01-10T08:00:00Z", "updated_at": "2024-01-12T10:00:00Z"}]`,
        functionOutputPayload: "Part of searchReservation response above"
      },
      {
        endpointName: "getProducts",
        pmsApiUrl: "hub/api/partner/resort/articles",
        responseName: "products",
        keyPmsVariables: "Product objects with id, label, article_category, vat_rate",
        outputFieldMapping: "Product catalog transformation",
        additionalNotes: "Hotel products and services",
        pmsSampleResponse: `[{"id": 101, "label": "Spa Treatment", "article_category": {"label": "Wellness"}, "vat_rate": {"id": 1, "vat_rate": 20.0}, "bookable": true}, {"id": 102, "label": "Room Service Breakfast", "article_category": {"label": "Food & Beverage"}, "vat_rate": {"id": 2, "vat_rate": 10.0}, "bookable": true}]`,
        functionOutputPayload: `{"products": [{"productCode": 101, //product.id
"productLabel": "Spa Treatment", //product.label
"productType": "Wellness", //product.article_category.label
"priceType": "PERSON",
"tax": {"taxCode": 1, //product.vat_rate.id
"taxValue": 20.0}, //product.vat_rate.vat_rate
"isActive": true}, //product.bookable
{"productCode": 102,
"productLabel": "Room Service Breakfast",
"productType": "Food & Beverage",
"priceType": "PERSON",
"tax": {"taxCode": 2,
"taxValue": 10.0},
"isActive": true}]}`
      },
      {
        endpointName: "getRates",
        pmsApiUrl: "hub/api/partner/hotel/rates",
        responseName: "ratePlans",
        keyPmsVariables: "Rate objects with id, label, public, deleted",
        outputFieldMapping: "Rate plan definitions",
        additionalNotes: "Room rate information",
        pmsSampleResponse: `[{"id": "RATE-001", "label": "Standard Rate", "public": true, "deleted": false}, {"id": "RATE-002", "label": "Corporate Rate", "public": false, "deleted": false}, {"id": "RATE-003", "label": "Seasonal Rate", "public": true, "deleted": true}]`,
        functionOutputPayload: `[{"rateCode": "RATE-001", //ratePlan.id
"rateLabel": "Standard Rate", //ratePlan.label
"rateShortLabel": "Standard Rate", //ratePlan.label
"priceType": "",
"isActive": true, //!ratePlan.deleted
"isEnabled": true, //!ratePlan.deleted
"isPublic": true}, //ratePlan.public
{"rateCode": "RATE-002",
"rateLabel": "Corporate Rate",
"rateShortLabel": "Corporate Rate",
"priceType": "",
"isActive": true,
"isEnabled": true,
"isPublic": false}]`
      },
      {
        endpointName: "getResources",
        pmsApiUrl: "hub/api/partner/hotel/rooms",
        responseName: "resources",
        keyPmsVariables: "Room objects with id, label, room_type, nb_persons_max, deleted",
        outputFieldMapping: "Room/resource definitions",
        additionalNotes: "Hotel room inventory",
        pmsSampleResponse: `[{"id": "ROOM-001", "label": "Room 101", "room_type": {"label": "Standard Room", "nb_persons_min": 1, "nb_persons_max": 2}, "nb_persons_max": 2, "deleted": false}, {"id": "ROOM-002", "label": "Suite 201", "room_type": {"label": "Junior Suite", "nb_persons_min": 1, "nb_persons_max": 4}, "nb_persons_max": 4, "deleted": false}]`,
        functionOutputPayload: `{"resourceTypes": [{"resourceCode": "ROOM-001", //resource.id
"resourceLabel": "Room 101", //resource.label
"minOccupancy": 1, //resource.room_type.nb_persons_min
"maxOccupancy": 2, //resource.nb_persons_max
"resourceType": "Standard Room", //resource.room_type.label
"isActive": true, //!resource.deleted
"slots": {},
"pmsFields": {}},
{"resourceCode": "ROOM-002",
"resourceLabel": "Suite 201",
"minOccupancy": 1,
"maxOccupancy": 4,
"resourceType": "Junior Suite",
"isActive": true,
"slots": {},
"pmsFields": {}}]}`
      },
      {
        endpointName: "searchContact",
        pmsApiUrl: "hub/api/partner/resort/customers",
        responseName: "contact",
        keyPmsVariables: "Customer objects with id, firstname, lastname, email, phone",
        outputFieldMapping: "Contact/customer information",
        additionalNotes: "Query params: q (search), ids (specific IDs)",
        pmsSampleResponse: `[{"id": "CUST-001", "firstname": "John", "lastname": "Doe", "email": "john.doe@email.com", "cellphone": "+1234567890", "phone": "+1987654321", "address": "123 Main St", "city": "New York", "postcode": "10001", "nationality": {"label": "American"}, "country": {"iso2": "US"}}]`,
        functionOutputPayload: `{"id": "CUST-001", //contact.id
"name": "John", //contact.firstname
"surname": "Doe", //contact.lastname
"email": "john.doe@email.com", //contact.email
"phone": "+1234567890", //contact.cellphone or contact.phone
"address": {"street": "123 Main St", //contact.address
"city": "New York", //contact.city
"state": "American", //contact.nationality.label
"country": "US", //contact.country.iso2
"zip": "10001"}} //contact.postcode`
      }
    ]
  },
  {
    name: "Apaleo",
    mappings: [
      {
        endpointName: "searchReservation",
        pmsApiUrl: "booking/v1/reservations?expand=booker,actions,timeSlices,services,assignedUnits,company&propertyIds={hotelId}&from={startDate}&to={endDate}&dateFilter={type}&status={state}",
        responseName: "Reservations",
        keyPmsVariables: "Id, BookingId, Status, RatePlan, UnitGroup, PrimaryGuest, TotalGrossAmount, Services, AssignedUnits",
        outputFieldMapping: "fileId ← Id, reservationId ← BookingId, state ← Status, roomTypeCode ← UnitGroup.Id, ratePlanCode ← RatePlan.Id",
        additionalNotes: "Uses expand query parameters for related data",
        pmsSampleResponse: `{"reservations": [{"id": "apl-rsv-123", "bookingId": "apl-bkg-456", "status": "Confirmed", "arrival": "2024-01-15T14:00:00Z", "departure": "2024-01-17T11:00:00Z", "unitGroup": {"id": "UTG-001", "code": "STD", "name": "Standard Room"}, "ratePlan": {"id": "RP-001", "name": "Best Available Rate"}, "primaryGuest": {"firstName": "John", "lastName": "Doe", "email": "john.doe@email.com", "phone": "+1234567890", "address": {"addressLine1": "123 Main St", "city": "New York", "countryCode": "US", "postalCode": "10001"}}, "totalGrossAmount": {"amount": 250.00, "currency": "USD"}, "services": [{"service": {"code": "BF", "name": "Breakfast"}, "totalAmount": {"grossAmount": 30.00, "netAmount": 25.00}, "dates": [{"serviceDate": "2024-01-15", "count": 2, "amount": {"grossAmount": 15.00, "netAmount": 12.50}}]}], "assignedUnits": [{"id": "UNIT-101", "name": "Room 101"}], "adults": 2, "children": 0, "infants": 0, "created": "2024-01-10T10:00:00Z", "modified": "2024-01-12T15:30:00Z"}]}`,
        functionOutputPayload: `{"reservations": {"2024-01-15": [{"fileId": "apl-rsv-123", //reservation.id
"yourRefId": "",
"guest": {"companyId": "", "contactId": ""},
"state": "Confirmed", //reservation.status
"marketing": {"source": "", "segment": "", "channel": ""},
"purpose": "",
"reservationId": "apl-bkg-456", //reservation.bookingId
"roomTypes": [{"roomTypeCode": "UTG-001", //reservation.unitGroup.id
"roomTypeLabel": "Standard Room", //reservation.unitGroup.name
"ratePlanCode": "RP-001", //reservation.ratePlan.id
"ratePlanLabel": "Best Available Rate", //reservation.ratePlan.name
"isVirtual": false,
"amountAfterTax": 250.00, //reservation.totalGrossAmount.amount
"discount": 0,
"taxValue": 0,
"taxPercent": 0,
"numberOfRooms": 1, //reservation.assignedUnits.length
"guestCount": [{"ageCategoryId": "ADULTS", "numberOfGuest": 2}], //reservation.adults
"slots": {},
"pmsFields": {"serviceIds": "",
"ageCategory": [],
"tpSale": "",
"pmsState": "",
"voucherCode": "",
"guest": {"id": "",
"name": "John", //reservation.primaryGuest.firstName
"surname": "Doe", //reservation.primaryGuest.lastName
"email": "john.doe@email.com", //reservation.primaryGuest.email
"phone": "+1234567890", //reservation.primaryGuest.phone
"address": {"street": "123 Main St", //reservation.primaryGuest.address.addressLine1
"city": "New York", //reservation.primaryGuest.address.city
"state": "",
"country": "US", //reservation.primaryGuest.address.countryCode
"zip": "10001"}}, //reservation.primaryGuest.address.postalCode
"roomCode": "STD", //reservation.unitGroup.code
"roomCodeLabel": "Standard Room"}, //reservation.unitGroup.name
"orderItems": [{"name": "Breakfast", //service.service.name
"type": "EXTRA",
"amountAfterTax": 15.00, //service.dates[0].amount.grossAmount
"taxValue": 2.50, //calculated from gross-net
"count": 2}]}], //service.dates[0].count
"createdAt": "2024-01-10T10:00:00Z", //reservation.created
"updatedAt": "2024-01-12T15:30:00Z"}]}} //reservation.modified`
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "settings/v1/age-categories?propertyId={hotelId}",
        responseName: "AgeCategories",
        keyPmsVariables: "Id, Code, Name, MinAge, MaxAge",
        outputFieldMapping: "Age category mapping for guest count",
        additionalNotes: "Reference data for age categorization",
        pmsSampleResponse: `[{"id": "ac-001", "code": "ADULTS", "name": "Adults", "minAge": 18, "maxAge": 100}, {"id": "ac-002", "code": "CHILD", "name": "Children", "minAge": 0, "maxAge": 17}, {"id": "ac-003", "code": "BABY", "name": "Infants", "minAge": 0, "maxAge": 2}]`,
        functionOutputPayload: "Part of searchReservation response above"
      },
      {
        endpointName: "getProducts",
        pmsApiUrl: "rateplan/v1/services?pageSize={pageSize}&pageNumber={pageNumber}",
        responseName: "Services",
        keyPmsVariables: "Code, Name, ServiceType, PricingUnit",
        outputFieldMapping: "productCode ← Code, productLabel ← Name, serviceType ← ServiceType",
        additionalNotes: "Service catalog with pricing information",
        pmsSampleResponse: `{"services": [{"id": "svc-001", "code": "BF", "name": "Breakfast Service", "serviceType": "Food", "pricingUnit": "PerPerson", "isActive": true}, {"id": "svc-002", "code": "SPA", "name": "Spa Services", "serviceType": "Wellness", "pricingUnit": "PerService", "isActive": true}]}`,
        functionOutputPayload: `{"products": [{"productCode": "BF", //service.code
"productLabel": "Breakfast Service", //service.name
"productType": "Food", //service.serviceType
"priceType": "PerPerson", //service.pricingUnit
"tax": {},
"isActive": true}, //service.isActive
{"productCode": "SPA",
"productLabel": "Spa Services",
"productType": "Wellness",
"priceType": "PerService",
"tax": {},
"isActive": true}],
"totalCount": 2}`
      },
      {
        endpointName: "getHotelInfo",
        pmsApiUrl: "/hotelInfo",
        responseName: "HotelInfo",
        keyPmsVariables: "Hotel configuration data",
        outputFieldMapping: "Basic hotel information",
        additionalNotes: "Simple hotel info endpoint",
        pmsSampleResponse: `{"id": "apl-hotel-001", "name": "Apaleo Demo Hotel", "address": {"line1": "123 Demo Street", "city": "Berlin", "country": "DE", "postalCode": "10115"}, "email": "info@apaleohotel.com", "phone": "+49301234567", "timezone": "Europe/Berlin", "currency": "EUR", "language": "de-DE"}`,
        functionOutputPayload: `{"hotel": {"hotelCode": "apl-hotel-001", //hotel.id
"name": "Apaleo Demo Hotel", //hotel.name
"language": "de-DE", //hotel.language
"currency": "EUR", //hotel.currency
"isActive": true,
"cityTaxCode": "",
"cin": "",
"taxNumber": "",
"address": {"address1": "123 Demo Street", //hotel.address.line1
"address2": "",
"address3": "",
"address4": "",
"city": "Berlin", //hotel.address.city
"zipCode": "10115", //hotel.address.postalCode
"country": "DE", //hotel.address.country
"email1": "info@apaleohotel.com", //hotel.email
"email2": "",
"phone1": "+49301234567", //hotel.phone
"phone2": "",
"cell1": "",
"cell2": ""}},
"additionalInfo": {"taxes": [],
"businessSegments": []}}`
      }
    ]
  },
  {
    name: "Stayntouch",
    mappings: [
      {
        endpointName: "searchReservation",
        pmsApiUrl: "connect/reservations?from_date={startDate}&to_date={endDate}&date_filter={type}&status={state}&hotel_id={hotelId}",
        responseName: "Reservations",
        keyPmsVariables: "Id, Arrival_date, Departure_date, Status, Stay_dates, Room, Rate_id",
        outputFieldMapping: "fileId ← Id, state ← Status mapping, roomTypeCode ← Room.room_type_id",
        additionalNotes: "Multi-endpoint with room types and rates",
        pmsSampleResponse: `{"results": [{"id": "snt-001", "confirmation_number": "CNF-123", "arrival_date": "2024-01-15", "departure_date": "2024-01-17", "status": "CONFIRMED", "adults": 2, "children": 0, "stay_dates": [{"date": "2024-01-15", "adults": 2, "children": 0, "room_type_id": "rt-001", "rate_id": "rate-001", "amount": 120.00}], "room": {"id": "room-101", "number": "101", "room_type_id": "rt-001"}, "guest": {"id": "guest-001", "first_name": "John", "last_name": "Smith", "email": "john.smith@email.com", "phone": "+1555123456"}, "created_at": "2024-01-10T09:00:00Z", "updated_at": "2024-01-12T14:00:00Z"}], "total_count": 1}`,
        functionOutputPayload: `{"reservations": {"2024-01-15": [{"fileId": "snt-001", //reservation.id
"yourRefId": "",
"guest": {"companyId": "", "contactId": "guest-001"}, //reservation.guest.id
"state": "confirmed", //statusMapping[reservation.status]
"marketing": {"source": "", "segment": "", "channel": ""},
"purpose": "",
"reservationId": "CNF-123", //reservation.confirmation_number
"roomTypes": [{"roomTypeCode": "rt-001", //reservation.room.room_type_id
"roomTypeLabel": "Standard Room", //roomTypes lookup
"ratePlanCode": "rate-001", //reservation.stay_dates[0].rate_id
"ratePlanLabel": "Best Available Rate", //ratePlans lookup
"isVirtual": false,
"amountAfterTax": 120.00, //reservation.stay_dates[0].amount
"discount": 0,
"taxValue": 0,
"taxPercent": 0,
"numberOfRooms": 1,
"guestCount": [{"ageCategoryId": "adult", "numberOfGuest": 2}], //reservation.adults
"slots": {},
"pmsFields": {"serviceIds": "",
"ageCategory": [{"ageCategoryId": "adult", "name": "Adult", "minimalAge": 18, "maximalAge": 100}],
"tpSale": "",
"pmsState": "",
"voucherCode": "",
"guest": {"id": "guest-001", //reservation.guest.id
"name": "John", //reservation.guest.first_name
"surname": "Smith", //reservation.guest.last_name
"email": "john.smith@email.com", //reservation.guest.email
"phone": "+1555123456", //reservation.guest.phone
"address": {"street": "", "city": "", "state": "", "country": "", "zip": ""}},
"roomCode": "101", //reservation.room.number
"roomCodeLabel": "Room 101"}, //room mapping
"orderItems": []}],
"createdAt": "2024-01-10T09:00:00Z", //reservation.created_at
"updatedAt": "2024-01-12T14:00:00Z"}]}} //reservation.updated_at`
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "connect/hotels/{id}/room_types",
        responseName: "RoomTypes",
        keyPmsVariables: "Id, Code, Name, Min_occupancy, Max_occupancy",
        outputFieldMapping: "Room type reference data",
        additionalNotes: "Reference data for room types",
        pmsSampleResponse: `[{"id": "rt-001", "code": "STD", "name": "Standard Room", "min_occupancy": 1, "max_occupancy": 2, "suite": false}, {"id": "rt-002", "code": "STE", "name": "Suite", "min_occupancy": 1, "max_occupancy": 4, "suite": true}]`,
        functionOutputPayload: "Part of searchReservation response above"
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "connect/hotels/{id}/rates",
        responseName: "RatePlans",
        keyPmsVariables: "Id, Code, Name, Active, Public_rate",
        outputFieldMapping: "Rate plan reference data",
        additionalNotes: "Reference data for rate plans",
        pmsSampleResponse: `[{"id": "rate-001", "code": "BAR", "name": "Best Available Rate", "active": true, "public_rate": true}, {"id": "rate-002", "code": "CORP", "name": "Corporate Rate", "active": true, "public_rate": false}]`,
        functionOutputPayload: "Part of searchReservation response above"
      },
      {
        endpointName: "searchContact",
        pmsApiUrl: "connect/guests?id={id}&name={name}&email={email}&phone={phone}&hotel_id={hotelId}&page={page}&per_page={perPage}",
        responseName: "Guests",
        keyPmsVariables: "Id, First_name, Last_name, Email, Phone, Address",
        outputFieldMapping: "id ← Id, name ← First_name, surname ← Last_name, email ← Email",
        additionalNotes: "Guest profile information",
        pmsSampleResponse: `{"results": [{"id": "guest-001", "first_name": "Jane", "last_name": "Doe", "email": "jane.doe@email.com", "phone": "+1555987654", "address": {"address_line1": "456 Oak Street", "city": "Boston", "state": "MA", "country_code": "US", "postal_code": "02101"}, "date_of_birth": "1985-05-20", "nationality": "US", "gender": "F", "created_at": "2024-01-01T00:00:00Z", "updated_at": "2024-01-15T12:00:00Z"}], "total_count": 1}`,
        functionOutputPayload: `[{"id": "guest-001", //guest.id
"title": "",
"name": "Jane", //guest.first_name
"surname": "Doe", //guest.last_name
"secondSurname": "",
"nationality": "US", //guest.nationality
"sex": "F", //guest.gender
"birthDate": "1985-05-20", //guest.date_of_birth
"birthPlace": "",
"occupation": "",
"email": "jane.doe@email.com", //guest.email
"phone": "+1555987654", //guest.phone
"loyaltyCode": "",
"notes": "",
"carRegistrationNumber": "",
"dietaryRequirements": "",
"taxIdentificationNumber": "",
"companyId": "",
"address": {"address1": "456 Oak Street", //guest.address.address_line1
"address2": "",
"city": "Boston", //guest.address.city
"zipCode": "02101", //guest.address.postal_code
"country": "US"}, //guest.address.country_code
"identityCard": "",
"driversLicense": "",
"passport": null,
"visa": null,
"classifications": [],
"options": [],
"chainId": "",
"italianDestinationCode": "",
"italianFiscalCode": ""}]`
      },
      {
        endpointName: "getCompany",
        pmsApiUrl: "connect/accounts?id={id}&type=COMPANY&search_keyword={name}&page={page}&per_page={perPage}",
        responseName: "Companies",
        keyPmsVariables: "Id, Name, Email, Phone, Address, Account_number, Tax_number",
        outputFieldMapping: "id ← Id, name ← Name, email ← Email, siretNumber ← Account_number, vatNumber ← Tax_number",
        additionalNotes: "Corporate client information",
        pmsSampleResponse: `{"results": [{"id": "comp-001", "name": "ABC Corporation", "email": "billing@abccorp.com", "phone": "+1555111000", "address": {"address_line1": "789 Business Ave", "city": "Chicago", "state": "IL", "country_code": "US", "postal_code": "60601"}, "account_number": "ACC-12345", "tax_number": "TAX-67890", "type": "COMPANY", "ar_number": "AR-001", "created_at": "2024-01-01T00:00:00Z"}], "total_count": 1}`,
        functionOutputPayload: `[{"id": "comp-001", //company.id
"isActive": true,
"siretNumber": "ACC-12345", //company.account_number
"vatNumber": "TAX-67890", //company.tax_number
"name": "ABC Corporation", //company.name
"email": "billing@abccorp.com", //company.email
"phone": "+1555111000", //company.phone
"address": {"street": "789 Business Ave", //company.address.address_line1
"city": "Chicago", //company.address.city
"country": "US", //company.address.country_code
"zip": "60601"}, //company.address.postal_code
"accountNumber": "ACC-12345", //company.account_number
"type": "COMPANY", //company.type
"arNumber": "AR-001"}] //company.ar_number`
      },
      {
        endpointName: "getProducts",
        pmsApiUrl: "connect/addons?page={page}&per_page={perPage}&id={id}&is_active={isActive}",
        responseName: "Products",
        keyPmsVariables: "Id, Name, Short_name, Price, Charging_mode, Service_type, Is_active",
        outputFieldMapping: "productCode ← Id, productLabel ← Name, price ← Price, chargingMode ← Charging_mode",
        additionalNotes: "Hotel products and amenities",
        pmsSampleResponse: `{"results": [{"id": "addon-001", "name": "Continental Breakfast", "short_name": "Breakfast", "price": 25.00, "charging_mode": "PerPerson", "service_type": "Food", "is_active": true, "accounting_category": {"classification": "Revenue", "name": "Food & Beverage", "code": "FB001"}, "tax": {"code": "VAT", "value": 10.0}}, {"id": "addon-002", "name": "Airport Transfer", "short_name": "Transfer", "price": 50.00, "charging_mode": "PerService", "service_type": "Transportation", "is_active": true, "accounting_category": {"classification": "Revenue", "name": "Transportation", "code": "TRANS001"}, "tax": {"code": "VAT", "value": 10.0}}], "total_count": 2}`,
        functionOutputPayload: `{"products": [{"productCode": "addon-001", //product.id
"productLabel": "Continental Breakfast", //product.name
"productShortLabel": "Breakfast", //product.short_name
"accountingCategory": {"classification": "Revenue", //product.accounting_category.classification
"name": "Food & Beverage", //product.accounting_category.name
"code": "FB001"}, //product.accounting_category.code
"serviceId": "", //product.service_id
"serviceType": "Food", //product.service_type
"price": 25.00, //product.price
"chargingMode": "PerPerson", //product.charging_mode
"tax": {"taxCode": "VAT", //product.tax.code
"taxValue": 10.0}, //product.tax.value
"isActive": true}, //product.is_active
{"productCode": "addon-002",
"productLabel": "Airport Transfer",
"productShortLabel": "Transfer",
"accountingCategory": {"classification": "Revenue",
"name": "Transportation",
"code": "TRANS001"},
"serviceId": "",
"serviceType": "Transportation",
"price": 50.00,
"chargingMode": "PerService",
"tax": {"taxCode": "VAT",
"taxValue": 10.0},
"isActive": true}],
"totalCount": 2}`
      },
      {
        endpointName: "getResourceCategory",
        pmsApiUrl: "connect/hotels/{id}/room_types",
        responseName: "RoomTypes",
        keyPmsVariables: "Id, Name, Min_occupancy, Max_occupancy, Suite",
        outputFieldMapping: "resourceLabel ← Name, resourceCode ← Id, maxOccupancy ← Max_occupancy",
        additionalNotes: "Room type definitions",
        pmsSampleResponse: `{"results": [{"id": "rt-001", "name": "Standard Room", "code": "STD", "min_occupancy": 1, "max_occupancy": 2, "suite": false, "service_id": "svc-001"}, {"id": "rt-002", "name": "Deluxe Suite", "code": "STE", "min_occupancy": 1, "max_occupancy": 4, "suite": true, "service_id": "svc-001"}], "total_count": 2}`,
        functionOutputPayload: `{"resourceTypes": [{"resourceLabel": "Standard Room", //roomType.name
"resourceCode": "rt-001", //roomType.id
"minOccupancy": 1, //roomType.min_occupancy
"maxOccupancy": 2, //roomType.max_occupancy
"resourceType": "Room", //!roomType.suite ? "Room" : "Suite"
"isActive": true,
"slots": {},
"pmsFields": {"serviceIds": "svc-001",
"ageCategory": {},
"resources": [{"label": "101", //room.number
"parent": null,
"state": "Clean", //mapRoomState(room.status)
"id": "room-101"}]}}, //room.id
{"resourceLabel": "Deluxe Suite",
"resourceCode": "rt-002",
"minOccupancy": 1,
"maxOccupancy": 4,
"resourceType": "Suite",
"isActive": true,
"slots": {},
"pmsFields": {"serviceIds": "svc-001",
"ageCategory": {},
"resources": [{"label": "201",
"parent": null,
"state": "Clean",
"id": "room-201"},
{"label": "202",
"parent": null,
"state": "Occupied",
"id": "room-202"}]}}]}`
      },
      {
        endpointName: "getResourceCategory",
        pmsApiUrl: "connect/hotels/{id}/rooms",
        responseName: "Rooms",
        keyPmsVariables: "Id, Number, Room_type_id, Status",
        outputFieldMapping: "Individual room details",
        additionalNotes: "Specific rooms linked to room types",
        pmsSampleResponse: `[{"id": "room-101", "number": "101", "room_type_id": "rt-001", "status": "CLEAN"}, {"id": "room-201", "number": "201", "room_type_id": "rt-002", "status": "CLEAN"}, {"id": "room-202", "number": "202", "room_type_id": "rt-002", "status": "OCCUPIED"}]`,
        functionOutputPayload: "Part of getResourceCategory response above"
      },
      {
        endpointName: "getRates",
        pmsApiUrl: "connect/hotels/{id}/rates?page={page}&per_page={perPage}&hotel_id={hotelId}",
        responseName: "Rates",
        keyPmsVariables: "Id, Name, Code, Active, Public_rate, Charge_code",
        outputFieldMapping: "rateCode ← Id, rateLabel ← Name, isActive ← Active, isPublic ← Public_rate",
        additionalNotes: "Rate definitions and pricing",
        pmsSampleResponse: `{"results": [{"id": "rate-001", "name": "Best Available Rate", "code": "BAR", "active": true, "public_rate": true, "charge_code": {"charge_code_type": "Accommodation"}}, {"id": "rate-002", "name": "Corporate Rate", "code": "CORP", "active": true, "public_rate": false, "charge_code": {"charge_code_type": "Accommodation"}}], "total_count": 2}`,
                 functionOutputPayload: `[{"rateCode": "rate-001", //rate.id
"rateLabel": "Best Available Rate", //rate.name
"rateShortLabel": "BAR", //rate.code
"priceType": "Accommodation", //rate.charge_code.charge_code_type
"isActive": true, //rate.active
"isEnabled": true,
"isPublic": true}, //rate.public_rate
{"rateCode": "rate-002",
"rateLabel": "Corporate Rate",
"rateShortLabel": "CORP",
"priceType": "Accommodation",
"isActive": true,
"isEnabled": true,
"isPublic": false}]`
       },
       {
         endpointName: "updateInventory",
         pmsApiUrl: "connect/rates/{rateId}/amounts",
         responseName: "UpdateRateAmounts",
         keyPmsVariables: "Update response confirmation",
         outputFieldMapping: "Inventory update confirmation",
         additionalNotes: "Updates rate amounts in PMS",
         pmsSampleResponse: `{"success": true, "message": "Rate amounts updated successfully", "updated_rates": 5}`,
         functionOutputPayload: `{"success": true, //response.success
"message": "Rate amounts updated successfully", //response.message
"updated_rates": 5} //response.updated_rates`
       },
       {
         endpointName: "getHotelInfo",
         pmsApiUrl: "connect/hotels/{id}",
         responseName: "HotelDetails",
         keyPmsVariables: "Id, Name, Currency_code, Address, Main_contact, Phone",
         outputFieldMapping: "hotelCode ← Id, name ← Name, currency ← Currency_code",
         additionalNotes: "Primary hotel information",
         pmsSampleResponse: `{"id": "hotel-001", "uuid": "uuid-123", "name": "Grand Stayntouch Hotel", "currency_code": "USD", "code": "GSH", "phone": "+1555000123", "address": {"address1": "789 Hotel Boulevard", "address2": "Floor 10", "address3": "", "city": "Miami", "postal_code": "33101", "country": "US"}, "main_contact": {"email": "info@grandstayntouch.com"}}`,
         functionOutputPayload: `{"hotel": {"hotelCode": "uuid-123", //hotelDetails.uuid or hotelDetails.id
"name": "Grand Stayntouch Hotel", //hotelDetails.name
"language": "en-GB", //default
"currency": "USD", //hotelDetails.currency_code
"isActive": true, //default
"cityTaxCode": "GSH", //hotelDetails.code
"cin": "",
"taxNumber": "",
"address": {"address1": "789 Hotel Boulevard", //hotelDetails.address.address1
"address2": "Floor 10", //hotelDetails.address.address2
"address3": "", //hotelDetails.address.address3
"address4": "",
"city": "Miami", //hotelDetails.address.city
"zipCode": "33101", //hotelDetails.address.postal_code
"country": "US", //hotelDetails.address.country
"email1": "info@grandstayntouch.com", //hotelDetails.main_contact.email
"email2": "",
"phone1": "+1555000123", //hotelDetails.phone
"phone2": "",
"cell1": "",
"cell2": ""}},
"additionalInfo": {"taxes": [],
"businessSegments": [{"id": "seg-001", //segment.id
"name": "Corporate"}]}}} //segment.name`
       },
       {
         endpointName: "getHotelInfo",
         pmsApiUrl: "connect/hotels/{id}/segments",
         responseName: "HotelSegments",
         keyPmsVariables: "Id, Name",
         outputFieldMapping: "Business segments for hotel",
         additionalNotes: "Market segment information",
         pmsSampleResponse: `{"results": [{"id": "seg-001", "name": "Corporate"}, {"id": "seg-002", "name": "Leisure"}, {"id": "seg-003", "name": "Group"}], "total_count": 3}`,
         functionOutputPayload: "Part of getHotelInfo response above"
       }
    ]
  },
  {
    name: "Lean",
    mappings: [
      {
        endpointName: "searchReservation",
        pmsApiUrl: "api/v2/statistics/reservations?hotel={hotelId}&date_from_since={startDate}&date_from_until={endDate}",
        responseName: "ReservationsData",
        keyPmsVariables: "Id, Status, Date_from, Date_to, Main_guest, Charges, Room_type_id, Rate, Adults, Children, Babies",
        outputFieldMapping: "fileId ← Id, state ← Status, roomTypeCode ← Room_type_id",
        additionalNotes: "Multi-endpoint with reference data",
        pmsSampleResponse: `{"results": [{"id": "lean-001", "status": "Confirmed", "date_from": "2024-01-15T14:00:00Z", "date_to": "2024-01-17T11:00:00Z", "main_guest": {"id": "guest-001", "name": "John", "surname": "Doe", "email": "john.doe@email.com", "phone": "+1555123456", "address": "123 Main St", "city": "New York", "postal_code": "10001", "country_alfa2": "US"}, "room_type_id": "rt-001", "room_type": "Standard Room", "room": "101", "rate": "rate-001", "adults": 2, "children": 0, "babies": 0, "charges": [{"id": "charge-001", "description": "Room Charge", "type": 1, "product": "ACC-001", "consumption_date": "2024-01-15T00:00:00Z", "quantity": 1, "value": 120.00, "net_value": 100.00, "tax_value": 20.00, "currency": "EUR", "created_at": "2024-01-10T10:00:00Z", "updated_at": "2024-01-12T15:30:00Z"}], "rateinfo": [{"rate_id": "rate-001", "rate": "Best Available Rate"}], "company": "comp-001", "purpose": "purpose-001", "created_at": "2024-01-10T10:00:00Z", "updated_at": "2024-01-12T15:30:00Z"}]}`,
        functionOutputPayload: `{"reservations": {"2024-01-15": [{"fileId": "lean-001", //reservation.id
"yourRefId": "",
"guest": {"companyId": "comp-001", "contactId": ""}, //reservation.company
"state": "Confirmed", //reservation.status
"marketing": {"source": "", "segment": "", "channel": ""},
"purpose": "Business", //purposes[reservation.purpose]
"reservationId": "lean-001", //reservation.id
"roomTypes": [{"roomTypeCode": "STD", //roomCategories[reservation.room_type_id]
"roomTypeLabel": "Standard Room", //reservation.room_type
"ratePlanCode": "rate-001", //reservation.rate
"ratePlanLabel": "Best Available Rate", //rateData.rate
"isVirtual": false,
"amountAfterTax": 0,
"discount": 0,
"taxValue": 0,
"taxPercent": 0,
"numberOfRooms": 1,
"guestCount": [{"ageCategoryId": "ADULTS", "numberOfGuest": 2}], //reservation.adults
"slots": {},
"pmsFields": {"serviceIds": "",
"ageCategory": [{"ageCategoryId": "ADULTS", "name": "Adult", "minimalAge": 18, "maximalAge": 100}],
"guest": {"id": "guest-001", //main_guest.id
"name": "John", //main_guest.name
"surname": "Doe", //main_guest.surname
"email": "john.doe@email.com", //main_guest.email
"phone": "+1555123456", //main_guest.phone
"address": {"street": "123 Main St", //main_guest.address
"city": "New York", //main_guest.city
"country": "US", //main_guest.country_alfa2
"zip": "10001"}}, //main_guest.postal_code
"roomCode": "101", //reservation.room
"roomCodeLabel": ""},
"orderItems": [{"name": "Room Charge", //charge.description
"productCode": "ACC-001", //charge.product
"type": "ACCOMMODATION", //charge.type mapping
"count": 1, //charge.quantity
"currency": "EUR",
"amountAfterTax": 120.00, //charge.value
"taxValue": 20.00, //charge.tax_value
"taxPercent": 20.0}]}], //calculated percentage
"createdAt": "2024-01-10T10:00:00Z", //reservation.created_at
"updatedAt": "2024-01-12T15:30:00Z"}]}} //reservation.updated_at`
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "api/v2/purposes",
        responseName: "PurposeData",
        keyPmsVariables: "Id, Name",
        outputFieldMapping: "Purpose mapping for reservations",
        additionalNotes: "Reference data for reservation purposes",
        pmsSampleResponse: `[{"id": "purpose-001", "name": "Business", "deleted": false}, {"id": "purpose-002", "name": "Leisure", "deleted": false}, {"id": "purpose-003", "name": "Group", "deleted": false}]`,
        functionOutputPayload: "Part of searchReservation response above"
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "api/v2/rooms?hotel={hotelId}",
        responseName: "RoomsData",
        keyPmsVariables: "Id, Number, Room_type_id, Status",
        outputFieldMapping: "Room inventory with types",
        additionalNotes: "Reference data for rooms",
        pmsSampleResponse: `[{"id": "room-001", "number": "101", "room_type_id": "rt-001", "status": "Available"}, {"id": "room-002", "number": "102", "room_type_id": "rt-001", "status": "Occupied"}, {"id": "room-003", "number": "201", "room_type_id": "rt-002", "status": "Available"}]`,
        functionOutputPayload: "Part of searchReservation response above"
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "api/v2/roomtypes?hotel={hotelId}",
        responseName: "RoomtypesData",
        keyPmsVariables: "Id, Code, Name, Deleted",
        outputFieldMapping: "Room type definitions",
        additionalNotes: "Reference data for room types",
        pmsSampleResponse: `[{"id": "rt-001", "code": "STD", "name": "Standard Room", "deleted": false}, {"id": "rt-002", "code": "STE", "name": "Suite", "deleted": false}, {"id": "rt-003", "code": "DEL", "name": "Deluxe Room", "deleted": false}]`,
        functionOutputPayload: "Part of searchReservation response above"
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "api/v2/products?hotel={hotelId}",
        responseName: "ProductsData",
        keyPmsVariables: "Id, Name, Price, Currency, Tax",
        outputFieldMapping: "Product catalog with pricing",
        additionalNotes: "Reference data for products and services",
        pmsSampleResponse: `[{"id": "prod-001", "name": "Continental Breakfast", "price": 25.00, "currency": "EUR", "tax": 5.00, "deleted": false}, {"id": "prod-002", "name": "Spa Access", "price": 45.00, "currency": "EUR", "tax": 9.00, "deleted": false}]`,
        functionOutputPayload: "Part of searchReservation response above"
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "api/v2/chargestypes?hotel={hotelId}",
        responseName: "ChargesTypes",
        keyPmsVariables: "Id, Name, Type",
        outputFieldMapping: "Charge type definitions",
        additionalNotes: "Reference data for charge categorization",
        pmsSampleResponse: `[{"id": "ct-001", "name": "Accommodation", "type": 1}, {"id": "ct-002", "name": "Service", "type": 2}, {"id": "ct-003", "name": "Extra", "type": 3}]`,
        functionOutputPayload: "Part of searchReservation response above"
      }
    ]
  },
  {
    name: "Medialog",
    mappings: [
      {
        endpointName: "searchReservation",
        pmsApiUrl: "GetRooms",
        responseName: "GetRooms",
        keyPmsVariables: "IdRoomType, Number, Id",
        outputFieldMapping: "Room inventory mapping",
        additionalNotes: "Reference data for rooms",
        pmsSampleResponse: `{"ServerReturn": [{"Id": "room-001", "Number": "101", "IdRoomType": "rt-001"}, {"Id": "room-002", "Number": "102", "IdRoomType": "rt-001"}, {"Id": "room-003", "Number": "201", "IdRoomType": "rt-002"}]}`,
        functionOutputPayload: `{"reservations": {"2024-01-15": [{"fileId": "mdl-001", //reservation.id
"yourRefId": "",
"guest": {"companyId": "", "contactId": "client-001"}, //reservation.Client.Id
"state": "confirmed", //RESERVATION_STATUS_ENUM[reservation.Statut]
"marketing": {"source": "", "segment": "Corporate", "channel": "Online"}, //segments/origins lookup
"purpose": "",
"reservationId": "mdl-001", //reservation.Id
"roomTypes": [{"roomTypeCode": "rt-001", //reservation.IdRoomType
"roomTypeLabel": "Standard Room", //roomsTypes lookup
"ratePlanCode": "",
"ratePlanLabel": "",
"isVirtual": false,
"amountAfterTax": 150.00, //calculated from orderItems
"discount": 0,
"taxValue": 25.00, //calculated from orderItems
"taxPercent": 16.67,
"numberOfRooms": 1,
"guestCount": [{"ageCategoryId": "NbPers", "numberOfGuest": 2}], //reservation.NbPers
"slots": {"slotCodeFrom": "", "slotCodeTo": ""},
"pmsFields": {"guest": {"id": "client-001", //Client.Id
"name": "Jean", //Client.FirstName
"surname": "Dupont", //Client.LastName
"email": "jean.dupont@email.com", //Client.Email
"phone": "+33123456789", //Client.Telephone.Mobile
"address": {"street": "123 Rue de la Paix", //Client.Adresse.Adresse
"city": "Paris", //Client.Adresse.Ville
"country": "FR", //Client.Adresse.Pays
"zip": "75001"}}, //Client.Adresse.CodePostal
"roomId": "room-001", //roomData.Id
"roomLabel": "101"}, //roomData.Number
"orderItems": [{"name": "Accommodation", //productsLabel lookup
"productCode": "prod-001", //product.IdProduit
"count": 1, //product.QuantiteBase
"currency": "EUR",
"amountAfterTax": 150.00, //product.Prix + taxes
"taxValue": 25.00, //calculated taxes
"taxPercent": 16.67, //calculated percentage
"type": "ACCOMMODATION"}]}], //product.IsHebergement mapping
"createdAt": "2024-01-10T10:00:00Z", //reservation.DateCreation
"updatedAt": "2024-01-12T15:30:00Z"}]}} //reservation.DateLastChange`
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "GetRoomTypes",
        responseName: "GetRoomTypes",
        keyPmsVariables: "Id, FriendlyName",
        outputFieldMapping: "Room type definitions",
        additionalNotes: "Reference data for room types",
        pmsSampleResponse: `{"ServerReturn": [{"Id": "rt-001", "FriendlyName": "Standard Room"}, {"Id": "rt-002", "FriendlyName": "Superior Room"}, {"Id": "rt-003", "FriendlyName": "Suite"}]}`,
        functionOutputPayload: "Part of searchReservation response above"
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "GetOrigines",
        responseName: "GetOrigines",
        keyPmsVariables: "Id, Name",
        outputFieldMapping: "Booking channel origins",
        additionalNotes: "Reference data for booking sources",
        pmsSampleResponse: `{"ServerReturn": [{"Id": "orig-001", "Name": "Direct Booking"}, {"Id": "orig-002", "Name": "Booking.com"}, {"Id": "orig-003", "Name": "Expedia"}]}`,
        functionOutputPayload: "Part of searchReservation response above"
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "GetSegments",
        responseName: "GetSegments",
        keyPmsVariables: "Id, Name",
        outputFieldMapping: "Market segments",
        additionalNotes: "Reference data for customer segments",
        pmsSampleResponse: `{"ServerReturn": [{"Id": "seg-001", "Name": "Leisure"}, {"Id": "seg-002", "Name": "Corporate"}, {"Id": "seg-003", "Name": "Group"}]}`,
        functionOutputPayload: "Part of searchReservation response above"
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "GetProducts",
        responseName: "GetProducts",
        keyPmsVariables: "Id, Libelle",
        outputFieldMapping: "Product catalog",
        additionalNotes: "Reference data for products and services",
        pmsSampleResponse: `{"ServerReturn": [{"Id": "prod-001", "Libelle": "Room Accommodation"}, {"Id": "prod-002", "Libelle": "Breakfast"}, {"Id": "prod-003", "Libelle": "City Tax"}]}`,
        functionOutputPayload: "Part of searchReservation response above"
      },
      {
        endpointName: "searchReservation",
        pmsApiUrl: "GetBookingSources",
        responseName: "GetBookingSources",
        keyPmsVariables: "Id, Name",
        outputFieldMapping: "Booking source mapping",
        additionalNotes: "Reference data for booking sources",
        pmsSampleResponse: `{"ServerReturn": [{"Id": "bs-001", "Name": "Website"}, {"Id": "bs-002", "Name": "Phone"}, {"Id": "bs-003", "Name": "Walk-in"}]}`,
        functionOutputPayload: "Part of searchReservation response above"
             }
    ]
  },
  {
    name: "Lighthouse",
    mappings: [
      {
        endpointName: "getHotelInfo",
        pmsApiUrl: "hotels",
        responseName: "HotelConfig",
        keyPmsVariables: "Hotel configuration data",
        outputFieldMapping: "Basic hotel setup information",
        additionalNotes: "Hotel configuration for competitor analysis",
        pmsSampleResponse: `{"id": "lh-hotel-001", "name": "Lighthouse Partner Hotel", "address": {"street": "456 Lighthouse Ave", "city": "San Francisco", "country": "US", "zipCode": "94102"}, "email": "contact@lighthousehotel.com", "phone": "+14155551234", "timezone": "America/Los_Angeles", "currency": "USD", "language": "en-US", "isActive": true}`,
        functionOutputPayload: `{"hotel": {"hotelCode": "lh-hotel-001", //hotel.id
"name": "Lighthouse Partner Hotel", //hotel.name
"language": "en-US", //hotel.language
"currency": "USD", //hotel.currency
"isActive": true, //hotel.isActive
"cityTaxCode": "",
"cin": "",
"taxNumber": "",
"address": {"address1": "456 Lighthouse Ave", //hotel.address.street
"address2": "",
"address3": "",
"address4": "",
"city": "San Francisco", //hotel.address.city
"zipCode": "94102", //hotel.address.zipCode
"country": "US", //hotel.address.country
"email1": "contact@lighthousehotel.com", //hotel.email
"email2": "",
"phone1": "+14155551234", //hotel.phone
"phone2": "",
"cell1": "",
"cell2": ""}},
"additionalInfo": {"taxes": [],
"businessSegments": []}}`
      }
    ]
  }
];  