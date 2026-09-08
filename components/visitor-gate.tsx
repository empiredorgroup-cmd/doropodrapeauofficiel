'use client';
import Image from 'next/image'; import {useEffect,useState} from 'react'; import type React from 'react'; import {createClient} from '@/lib/supabase/client';
export function VisitorGate(){const [show,setShow]=useState(false);const [form,setForm]=useState({nom:'',prenom:'',telephone:'',email:''});const [error,setError]=useState('');const [saved,setSaved]=useState(false);const [submitting,setSubmitting]=useState(false);
 useEffect(()=>{setShow(localStorage.getItem('dd_gate_passed')!=='1')},[]);
 if(!show)return null;
 const close=()=>{localStorage.setItem('dd_gate_passed','1');setShow(false)};
 const pass=async()=>{
  if(submitting)return;
  if(!form.nom.trim()||!form.prenom.trim()||!form.telephone.trim()){setError('Renseignez le nom, le prénom et le numéro de téléphone, ou continuez sans enregistrement.');return;}
  if(form.email && !/^\S+@\S+\.\S+$/.test(form.email)){setError('L’adresse e-mail saisie n’est pas valide.');return;}
  setError('');setSubmitting(true);
  const phone=form.telephone.replace(/\s+/g,'');
  const supabase=createClient();
  const {error:insertError}=await supabase.from('visitors').insert({first_name:form.prenom.trim(),last_name:form.nom.trim(),phone,email:form.email.trim()||null});
  setSubmitting(false);
  if(insertError && insertError.code!=='23505'){setError('Une erreur est survenue lors de l’enregistrement. Vous pouvez réessayer ou continuer sans enregistrement.');return}
  // code 23505 = numéro déjà enregistré (visiteur unique par téléphone) : on ne bloque pas l’accès pour autant.
  setSaved(true);setTimeout(close,850);
 };
 return <div className="gate" role="dialog" aria-modal="true" aria-label="Bienvenue sur DOROPO DRAPEAU"><div className="gate-bg"><Image src="/images/Logo 2.jpeg" alt="" fill sizes="100vw" className="gate-bg-logo"/><div className="gate-orb g1"/><div className="gate-orb g2"/></div><div className="gate-marquee">DOROPO DRAPEAU · UNITÉ · JEUNESSE · COHÉSION · FORMATION · CULTURE · ENGAGEMENT ·</div><div className="gate-card"><Image src="/images/Logo 1.jpeg" alt="Logo DOROPO DRAPEAU" width={150} height={150} className="gate-logo"/><p className="eyebrow">Bienvenue</p><h1>Entrez dans l’univers<br/><span>DOROPO DRAPEAU</span></h1><p className="gate-note">L’enregistrement est facultatif. Nom, prénom et téléphone servent uniquement à tenir un registre des visiteurs de l’association.</p><div className="gate-form"><label>Nom<input autoComplete="family-name" value={form.nom} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,nom:e.target.value})}/></label><label>Prénom<input autoComplete="given-name" value={form.prenom} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,prenom:e.target.value})}/></label><label>Numéro de téléphone<input type="tel" inputMode="tel" autoComplete="tel" value={form.telephone} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,telephone:e.target.value})}/></label><label>E-mail <span>(facultatif)</span><input type="email" autoComplete="email" value={form.email} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,email:e.target.value})}/></label>{error&&<p className="error" role="alert">{error}</p>}<button className="btn gold gate-submit" onClick={pass} disabled={submitting}>{submitting?'ENREGISTREMENT…':'OK, C’EST BON'}</button><button className="gate-skip" onClick={close}>Continuer sans enregistrement</button></div></div>{saved&&<div className="thumb" aria-hidden="true"><span>👍</span></div>}</div>}
