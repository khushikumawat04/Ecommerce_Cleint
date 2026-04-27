import { useState,useEffect } from "react";
import "../Styles/productFrom.css";

export default function ProductForm({ onSubmit, initialData = {} }) {
  const [isDraftSaved, setIsDraftSaved] = useState(false);
const [lastSaved, setLastSaved] = useState(null);
const [loading, setLoading] = useState(false);

const emptyForm = {
  name: "",
  tagline: "",
  shortDescription: "",
  fullDescription: "",
  price: "",
  originalPrice: "",
  discountPercent: "",
  shippingCharges: 0,
  category: "",
  stock: "",
  brand: "",
  productType: "",
  formType: "",
  quantity: "",
  ingredient: "",
  images: [""],
  highlights: [""],
  benefits: [""],
  whyChoose: [""],
  usage: {
    howToUse: "",
    hairApplication: "",
    skinUse: ""
  },
  seo: {
    title: "",
    description: "",
    keywords: [""]
  }
};

const [form, setForm] = useState(emptyForm);
useEffect(() => {
  if (!initialData || !initialData._id) return;

  setForm({
    name: initialData.name || "",
    tagline: initialData.tagline || "",
    shortDescription: initialData.shortDescription || "",
    fullDescription: initialData.fullDescription || "",

    price: initialData.price || "",
    originalPrice: initialData.originalPrice || "",
    discountPercent: initialData.discountPercent || "",
    shippingCharges: initialData.shippingCharges || 0,

    category: initialData.category || "",
    stock: initialData.stock || "",

    brand: initialData?.details?.brand || "",
    productType: initialData?.details?.productType || "",
    formType: initialData?.details?.form || "",
    quantity: initialData?.details?.quantity || "",
    ingredient: initialData?.details?.ingredient || "",

    images: initialData?.images?.length
      ? initialData.images.map(i => i.url)
      : [""],

    highlights: initialData?.highlights?.length ? initialData.highlights : [""],
    benefits: initialData?.benefits?.length ? initialData.benefits : [""],
    whyChoose: initialData?.whyChoose?.length ? initialData.whyChoose : [""],

    usage: {
      howToUse: initialData?.usage?.howToUse || "",
      hairApplication: initialData?.usage?.hairApplication || "",
      skinUse: initialData?.usage?.skinUse || ""
    },

    seo: {
      title: initialData?.seo?.title || "",
      description: initialData?.seo?.description || "",
      keywords: initialData?.seo?.keywords?.length
        ? initialData.seo.keywords
        : [""]
    }
  });
}, [initialData]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUsageChange = (e) => {
  setForm({
    ...form,
    usage: {
      ...form.usage,
      [e.target.name]: e.target.value
    }
  });
};
const handleSeoChange = (e) => {
  setForm({
    ...form,
    seo: {
      ...form.seo,
      [e.target.name]: e.target.value
    }
  });
};
const handleKeywordChange = (value, index) => {
  const updated = [...form.seo.keywords];
  updated[index] = value;

  setForm({
    ...form,
    seo: {
      ...form.seo,
      keywords: updated
    }
  });
};

const addKeyword = () => {
  setForm({
    ...form,
    seo: {
      ...form.seo,
      keywords: [...form.seo.keywords, ""]
    }
  });
};

const removeKeyword = (index) => {
  const updated = form.seo.keywords.filter((_, i) => i !== index);

  setForm({
    ...form,
    seo: {
      ...form.seo,
      keywords: updated
    }
  });
};

  // ARRAY HANDLER (images, benefits, highlights)
  const handleArrayChange = (type, value, index) => {
    const updated = [...form[type]];
    updated[index] = value;
    setForm({ ...form, [type]: updated });
  };

  const addField = (type) => {
    setForm({ ...form, [type]: [...form[type], ""] });
  };

  const removeField = (type, index) => {
    const updated = form[type].filter((_, i) => i !== index);
    setForm({ ...form, [type]: updated });
  };

  const submit = async (e) => {
  e.preventDefault();

  if (loading) return; // ❌ stop double click

  setLoading(true);

  await onSubmit({
    name: form.name,
    tagline: form.tagline,
    shortDescription: form.shortDescription,
    fullDescription: form.fullDescription,

    price: Number(form.price),
    originalPrice: Number(form.originalPrice),
    discountPercent: Number(form.discountPercent),
    shippingCharges: Number(form.shippingCharges),

    category: form.category,
    stock: Number(form.stock),

    highlights: form.highlights.filter(h => h),
    benefits: form.benefits.filter(b => b),
    whyChoose: form.whyChoose.filter(b => b),

    details: {
      brand: form.brand,
      productType: form.productType,
      form: form.formType,
      quantity: form.quantity,
      ingredient: form.ingredient
    },

    images: form.images.filter(img => img).map(url => ({ url })),

    usage: form.usage,

    seo: form.seo
  });

  localStorage.removeItem("product_draft");

  setLoading(false);
};

  const saveDraft = () => {
  localStorage.setItem("product_draft", JSON.stringify(form));
  setIsDraftSaved(true);
  setLastSaved(new Date().toLocaleTimeString());
};
useEffect(() => {
  const interval = setInterval(() => {
    localStorage.setItem("product_draft", JSON.stringify(form));
    setLastSaved(new Date().toLocaleTimeString());
  }, 5000); // 5 sec auto save

  return () => clearInterval(interval);
},);
useEffect(() => {
  const draft = localStorage.getItem("product_draft");

  if (draft) {
    setForm(JSON.parse(draft));
  }
}, []);
  return (
    <form onSubmit={submit} className="container p-4 bg-white shadow rounded">

      <h3 className="mb-3">🧾 Product Info</h3>

      <div className="row">

        <div className="col-md-6 mb-2">
          <label className="form-label">Product Name</label>
          <input className="form-control" name="name" placeholder="Product Name"   value={form.name} onChange={handleChange} />
        </div>

        <div className="col-md-6 mb-2">
          <label className="form-label">Tagline</label>
          <input className="form-control" name="tagline" placeholder="Tagline" value={form.tagline} onChange={handleChange} />
        </div>

      </div>
             <label className="form-label">Short Description</label>
      <textarea className="form-control mb-2" name="shortDescription" placeholder="Short Description" value={form.shortDescription} onChange={handleChange}></textarea>
 <label className="form-label">Full Description</label>
      <textarea className="form-control mb-3" name="fullDescription" placeholder="Full Description" value={form.fullDescription} onChange={handleChange}></textarea>

<br/>
      <h5>💰 Pricing</h5>

      <div className="row">

        <div className="col-md-3 mb-2">
          <label className="form-label">Selling Price</label>
          <input className="form-control" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        </div>

        <div className="col-md-3 mb-2">
          <label className="form-label">MRP</label>
          <input className="form-control" name="originalPrice" placeholder="MRP" value={form.originalPrice} onChange={handleChange} />
        </div>

        <div className="col-md-3 mb-2">
          <label className="form-label">Discount %</label>
          <input className="form-control" name="discountPercent" placeholder="Discount %" value={form.discountPercent} onChange={handleChange} />
        </div>

        <div className="col-md-3 mb-2">
          <label className="form-label">Shipping Charges</label>
          <input className="form-control" name="shippingCharges" placeholder="Shipping Charges" value={form.shippingCharges} onChange={handleChange} />
        </div>

      </div>

<br/>
      <h5>📦 Stock & Category</h5>

      <div className="row">

        <div className="col-md-6 mb-2">
          <label className="form-label">Category</label>
          <input className="form-control" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        </div>

        <div className="col-md-6 mb-2">
          <label className="form-label">Stock</label>
          <input className="form-control" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
        </div>

      </div>
<br/>
      <h5>🧪 Details</h5>

      <div className="row">

        <div className="col-md-4 mb-2">
          <label className="form-label">Brand</label>
          <input className="form-control" name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
        </div>

        <div className="col-md-4 mb-2">
          <label className="form-label">Product Type</label>
          <input className="form-control" name="productType" placeholder="Product Type" value={form.productType} onChange={handleChange} />
        </div>

        <div className="col-md-4 mb-2">
          <label className="form-label">Form</label>
          <input className="form-control" name="formType" placeholder="Form" value={form.formType} onChange={handleChange} />
        </div>

            <div className="col-md-4 mb-2">
              <label className="form-label">Quantity</label>
              <input className="form-control" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label">Ingredient</label>
              <input className="form-control" name="ingredient" placeholder="Ingredient" value={form.ingredient} onChange={handleChange} />
            </div>
              <div className="col-md-4 mb-2">
                <label className="form-label">Shelf Life</label>
                <input className="form-control" name="shelfLife" placeholder="Shelf Life" value={form.shelfLife} onChange={handleChange} />
              </div>
            

        
      </div>
<br/>
      <h5>⭐ Highlights</h5>
      {(form.highlights || []).map((h, i) => (
        <div key={i} className="d-flex mb-2">
          <input
            className="form-control"
            value={h}
            onChange={(e) => handleArrayChange("highlights", e.target.value, i)}
          />
          <button type="button" className="btn btn-danger ms-2" onClick={() => removeField("highlights", i)}>X</button>
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-add mb-3" onClick={() => addField("highlights")}>
        + Add Highlight
      </button>
<br></br>
      <h5>❤️ Benefits</h5>
      {(form.benefits || []).map((b, i) => (
        <div key={i} className="d-flex mb-2">
          <input
            className="form-control"
            value={b}
            onChange={(e) => handleArrayChange("benefits", e.target.value, i)}
          />
          <button type="button" className="btn btn-danger ms-2" onClick={() => removeField("benefits", i)}>X</button>
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-add mb-3" onClick={() => addField("benefits")}>
        + Add Benefit
      </button>
<br/>
<h5>Why Choose Us</h5>
      {(form.whyChoose || []) .map((b, i) => (
        <div key={i} className="d-flex mb-2">
          <input
            className="form-control"
            value={b}
            onChange={(e) => handleArrayChange("whyChoose", e.target.value, i)}
          />
          <button type="button" className="btn btn-danger ms-2" onClick={() => removeField("whyChoose", i)}>X</button>
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-add mb-3" onClick={() => addField("whyChoose")}>
        + Add Why Choose Us
      </button>
      <br/>
      <h5 className="section-title">🧴 Usage Instructions</h5>

<div className="section">

  <label className="form-label">How To Use</label>
  <textarea
    className="form-control mb-2"
    name="howToUse"
    value={form.usage.howToUse}
    onChange={handleUsageChange}
    placeholder="How to use product..."
  />

  <label className="form-label">Hairs Application</label>
  <textarea
    className="form-control mb-2"
    name="hairApplication"
    value={form.usage.hairApplication}
    onChange={handleUsageChange}
    placeholder="Hair usage instructions..."
  />

  <label className="form-label">Skin Use</label>
  <textarea
    className="form-control"
    name="skinUse"
    value={form.usage.skinUse}
    onChange={handleUsageChange}
    placeholder="Skin usage instructions..."
  />

</div>
{/* <br/> */}
<h5 className="section-title">🔍 SEO Settings</h5>

<div className="section">

  <label className="form-label">SEO Title</label>
  <input
    className="form-control mb-2"
    name="title"
    value={form.seo.title}
    onChange={handleSeoChange}
    placeholder="SEO Title"
  />

  <label className="form-label">SEO Description</label>
  <textarea
    className="form-control mb-3"
    name="description"
    value={form.seo.description}
    onChange={handleSeoChange}
    placeholder="SEO Description"
  />

  <label className="form-label">Keywords</label>

  {(form.seo.keywords || []).map((k, i) => (
    <div key={i} className="array-row">
      <input
        className="form-control"
        value={k}
        onChange={(e) => handleKeywordChange(e.target.value, i)}
        placeholder="Keyword"
      />

      <button
        type="button"
        className="btn-remove"
        onClick={() => removeKeyword(i)}
      >
        X
      </button>
    </div>
  ))}

  <button
    type="button"
    className="btn-add"
    onClick={addKeyword}
  >
    + Add Keyword
  </button>

</div>
{/* <br/> */}
      <h5>🖼 Images</h5>
      {(form.images || []).map((img, i) => (
        <div key={i} className="d-flex mb-2">
          <input
            className="form-control"
            value={img}
            onChange={(e) => handleArrayChange("images", e.target.value, i)}
          />
          <button type="button" className="btn btn-danger ms-2" onClick={() => removeField("images", i)}>X</button>
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-success mb-3" onClick={() => addField("images")}>
        + Add Image
      </button>
<br/>

<div className="d-flex justify-content-between align-items-center mb-3">

  <button
    type="button"
    className="btn btn-warning"
    onClick={saveDraft}
  >
    💾 Save Draft
  </button>

  <small style={{ color: "gray" }}>
    {lastSaved ? `Last saved at ${lastSaved}` : "Not saved yet"}
  </small>

</div>
    <button
  type="submit"
  className="btn btn-success w-100 mt-3"
  disabled={loading}
>
  {loading
    ? "Saving..."
    : initialData?._id
      ? "✏️ Edit Product"
      : "🚀 Save Product"}
</button>
    </form>
  );
}