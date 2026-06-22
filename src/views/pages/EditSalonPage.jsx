import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AREAS, SERVICE_TAGS, PRICE_RANGES } from "../../utils/constants";
import Footer from "../components/layout/Footer";
import "./EditSalonPage.css";

export default function EditSalonPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:"", area:AREAS[1], address:"", phone:"",
    hours:"10:00 AM – 8:00 PM", priceRange:"₹₹", about:"", tags:[], image:"",
  });
  const [services, setServices] = useState([{id:"s1",name:"",price:"",duration:""}]);
  const [saved, setSaved] = useState(false);

  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const toggleTag = t => setForm(f => ({
    ...f, tags: f.tags.includes(t) ? f.tags.filter(x=>x!==t) : [...f.tags,t]
  }));
  const addSvc = () => setServices(s => [...s, {id:`s${Date.now()}`,name:"",price:"",duration:""}]);
  const rmSvc  = id => setServices(s => s.filter(x => x.id !== id));
  const setSvc = (id,k,v) => setServices(s => s.map(x => x.id===id ? {...x,[k]:v} : x));

  const handleSubmit = e => {
    e.preventDefault();
    const salon = {
      ...form, id:`custom_${Date.now()}`,
      services: services.filter(s=>s.name).map(s => ({...s,price:Number(s.price),duration:Number(s.duration)})),
      rating:4.0, reviewCount:0, openNow:true, branch:form.area,
    };
    const prev = JSON.parse(localStorage.getItem("glamr_custom_salons")||"[]");
    localStorage.setItem("glamr_custom_salons", JSON.stringify([...prev, salon]));
    setSaved(true);
    setTimeout(() => navigate("/admin"), 1600);
  };

  return (
    <div className="page" style={{paddingBottom:0}}>
      <div className="container edit-salon-page">
        <div style={{margin:"40px 0 28px"}}>
          <span className="section-eyebrow">Admin</span>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:30,fontWeight:700}}>Add new salon</h1>
          <p style={{color:"var(--muted)",marginTop:6}}>Fill in the details to list a salon on Glamr Bangalore</p>
        </div>
        {saved && <div className="toast success" style={{position:"relative",bottom:"auto",right:"auto",marginBottom:16}}>✓ Salon saved! Redirecting to dashboard…</div>}

        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="edit-section">
            <h2>Basic info</h2>
            <div className="edit-grid">
              <div className="form-group">
                <label>Salon name *</label>
                <input className="form-control" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Naturals Salon" required />
              </div>
              <div className="form-group">
                <label>Area *</label>
                <select className="form-control" value={form.area} onChange={e=>set("area",e.target.value)}>
                  {AREAS.slice(1).map(a=><option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group" style={{gridColumn:"1/-1"}}>
                <label>Full address</label>
                <input className="form-control" value={form.address} onChange={e=>set("address",e.target.value)} placeholder="Door no, Street, Area, Bangalore - PIN" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input className="form-control" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+91 98860 XXXXX" />
              </div>
              <div className="form-group">
                <label>Working hours</label>
                <input className="form-control" value={form.hours} onChange={e=>set("hours",e.target.value)} />
              </div>
              <div className="form-group">
                <label>Price range</label>
                <select className="form-control" value={form.priceRange} onChange={e=>set("priceRange",e.target.value)}>
                  {PRICE_RANGES.map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Cover image URL</label>
                <input className="form-control" value={form.image} onChange={e=>set("image",e.target.value)} placeholder="https://images.unsplash.com/…" />
              </div>
              <div className="form-group" style={{gridColumn:"1/-1"}}>
                <label>About</label>
                <textarea className="form-control" rows={3} value={form.about} onChange={e=>set("about",e.target.value)} placeholder="Describe the salon…" />
              </div>
            </div>
            <div className="form-group" style={{marginTop:8}}>
              <label>Service tags</label>
              <div className="tag-select">
                {SERVICE_TAGS.slice(1).map(t => (
                  <button type="button" key={t}
                    className={`tag-pill${form.tags.includes(t)?" active":""}`}
                    onClick={()=>toggleTag(t)}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="edit-section">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h2>Services & pricing</h2>
              <button type="button" className="btn btn-outline" style={{fontSize:13,padding:"8px 16px"}} onClick={addSvc}>
                + Add service
              </button>
            </div>
            {services.map((svc,i) => (
              <div key={svc.id} className="service-edit-row">
                <div className="form-group" style={{flex:3}}>
                  {i===0&&<label>Service name</label>}
                  <input className="form-control" value={svc.name} onChange={e=>setSvc(svc.id,"name",e.target.value)} placeholder="e.g. Haircut & Styling" />
                </div>
                <div className="form-group" style={{flex:1}}>
                  {i===0&&<label>Price (₹)</label>}
                  <input className="form-control" type="number" value={svc.price} onChange={e=>setSvc(svc.id,"price",e.target.value)} placeholder="599" />
                </div>
                <div className="form-group" style={{flex:1}}>
                  {i===0&&<label>Duration (min)</label>}
                  <input className="form-control" type="number" value={svc.duration} onChange={e=>setSvc(svc.id,"duration",e.target.value)} placeholder="45" />
                </div>
                {services.length>1&&(
                  <button type="button" className="remove-svc-btn" onClick={()=>rmSvc(svc.id)} style={{marginTop:i===0?22:0}}>✕</button>
                )}
              </div>
            ))}
          </div>

          <div className="edit-actions">
            <button type="button" className="btn btn-outline" onClick={()=>navigate("/admin")}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save salon</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
