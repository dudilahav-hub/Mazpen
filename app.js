"use strict";

/* ---------- רשימת NC/PC (לפי טבלת Shapiro) — [זכר|נקבה] ---------- */
const NCS=[
 {cat:'אחריות · ערך עצמי',items:[
  ['אני לא [מספיק טוב|מספיקה טובה]','אני [מספיק טוב|מספיקה טובה] כמו שאני'],
  ['אני לא [שווה|שווה], אני אפס','אני [שווה|שווה], [בעל|בעלת] ערך'],
  ['אני [פגום|פגומה]','אני בסדר, אני [יכול|יכולה] להשתפר'],
  ['אני [מפסידן|מפסידנית]','אני [מנצח|מנצחת]'],
  ['לא ניתן לאהוב אותי','ניתן לאהוב אותי']]},
 {cat:'אחריות · פעולות ואשמה',items:[
  ['אני [אשם|אשמה]','אני [יכול|יכולה] ללמוד מטעויות העבר'],
  ['[הייתי צריך|הייתי צריכה] לדעת','עשיתי כמיטב יכולתי'],
  ['אני [חלש|חלשה]','אני [חזק|חזקה]'],
  ['לא ניתן לסלוח לי','אני [יכול|יכולה] לסלוח לעצמי ולהמשיך הלאה']]},
 {cat:'סכנה · פגיעות',items:[
  ['אני בסכנה','זה הסתיים, אני [בטוח|בטוחה] עכשיו'],
  ['אני לא [יכול|יכולה] לסמוך על אף אחד','אני [יכול|יכולה] לבחור במי לתת אמון'],
  ['אני [פגיע|פגיעה]','אני [עמיד|עמידה]'],
  ['זה לא בטוח להרגיש','אני [יכול|יכולה] להרגיש בביטחון'],
  ['אני לא [יכול|יכולה] לעמוד בזה','אני [יכול|יכולה] להתמודד עם זה']]},
 {cat:'שליטה · אפשרויות',items:[
  ['אני לא בשליטה','אני עכשיו בשליטה'],
  ['אני [חסר|חסרת] אונים','כעת יש לי אפשרות לבחור'],
  ['אני [כלוא|כלואה]','אני [חופשי|חופשייה]'],
  ['אני לא [יכול|יכולה] להתמודד','אני [יכול|יכולה] להתמודד'],
  ['אני לא [יכול|יכולה] לסמוך על עצמי','אני [יכול|יכולה] ללמוד לסמוך על עצמי']]},
 {cat:'שייכות · חיבור',items:[
  ['אני לא [שייך|שייכת]','אני [שייך|שייכת]'],
  ['אני [בלתי נראה|בלתי נראית]','מגיע לי להיות [נראה|נראית]'],
  ['אני לא [נחשב|נחשבת]','אני [נחשב|נחשבת]'],
  ['אני לבד','אני לא לבד, אני [מחובר|מחוברת]']]}
];

/* ---------- נתוני דוגמה ---------- */
function seed(){return{id:uid(),created:Date.now(),demo:true,
 client:{name:'נועה',gender:'f',bls:{type:'תנועות עיניים',dir:'אופקי',dist:'כ-40 ס״מ'},stop:'יד מורמת'},
 plan:{problem:'חרדה חזקה לפני הצגה מול הצוות',
  examples:'ישיבת הצוות ביום ראשון: קפאה כשביקשו ממנה עדכון.\nהצגת פרויקט ללקוח בספטמבר.',
  rep:'ישיבת הצוות ביום ראשון',
  memories:[
   {text:'ההצגה בכיתה ו׳, המורה העירה מול כולם',age:'11',touch:true,worst:false},
   {text:'הביקורת של אבא על הציונים',age:'13',touch:false,worst:false},
   {text:'מבחן בעל-פה בשנה ב׳',age:'22',touch:false,worst:true}],
  triggers:['כל פעם שמבקשים ממנה עדכון בישיבה, הגרון נסגר'],
  future:['הצגת הרבעון בינואר'],
  resHave:'אחותה, הים, חוש הומור',
  resNeed:['ביטחון','קול פנימי מרגיע']},
 resources:[{kind:'מקום בטוח',image:'חוף פלמחים בשקיעה, רגליים בחול החם',emotions:'רוגע, חום בחזה',cue:'גלים'}],
 targets:[
  {name:'כיתה ו׳: ההצגה',kind:'עבר',status:'בעיבוד',touch:true},
  {name:'הביקורת של אבא',kind:'עבר',status:'ממתין'},
  {name:'המבחן בעל-פה',kind:'עבר',status:'ממתין'},
  {name:'ישיבת צוות',kind:'הווה',status:'ממתין'},
  {name:'הצגת הרבעון',kind:'עתיד',status:'ממתין'}],
 sessions:[{date:'6.10.2026',target:'כיתה ו׳: ההצגה',image:'המורה מסתכלת עליה והכיתה צוחקת',
  nc:'אני לא [מספיק טוב|מספיקה טובה]',pc:'אני [מספיק טוב|מספיקה טובה] כמו שאני',voc0:2,
  emotions:'בושה, פחד',sud0:8,body:'גרון וחזה',sudEnd:4,vocEnd:null,bodyClear:false,complete:false,sets:14,
  stab:'מקום בטוח',reflect:'אני יכולה לעצור כשצריך',
  notes:'עלה זיכרון של אבא מבקר את הציונים. לבדוק כזיכרון מזין.',sudLog:[8,7,6,6,4]}]
}}
let DB=null,D=null;
const R={view:'boot',flow:null,step:null,s:{},hist:[],list:[],blsOn:false,sumIdx:null,msg:null,info:null};

/* ---------- עזרים ---------- */
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const G=s=>String(s??'').replace(/\[([^|\]]*)\|([^\]]*)\]/g,(m,a,b)=>D.client.gender==='f'?b:a);
const res=()=>D.resources[0];
const lastS=()=>D.sessions[D.sessions.length-1];
function vals(){const s=R.s||{};return{NC:s.nc,PC:s.pc,IMG:s.image,TGT:s.target,CUE:res()&&res().cue,RES:res()&&res().image,
 CHOSEN:s.chosen!=null&&D.plan.memories[s.chosen]?D.plan.memories[s.chosen].text:null,
 BLS:D.client.bls.type,STOPSIGN:D.client.stop,PROBLEM:D.plan.problem,REP:D.plan.rep}}
function fill(str){const v=vals();return esc(G(str)).replace(/\{(\w+)\}/g,(m,k)=>v[k]!=null&&v[k]!==''?`<span class="w">${esc(G(v[k]))}</span>`:`<span class="w e">___</span>`)}
function objFor(root){return{plan:D.plan,client:D.client,s:R.s}[root]}
function getVal(key){const [r,f]=key.split('.');return objFor(r)[f]}
function setVal(key,v){const [r,f]=key.split('.');objFor(r)[f]=v}
const today=()=>{const d=new Date();return d.getDate()+'.'+(d.getMonth()+1)+'.'+d.getFullYear()};
function stClass(st){return{'הושלם':'st-done','בעיבוד':'st-prog','הבא בתור':'st-next','חדש':'st-next'}[st]||'st-wait'}
function newS(){return{log:[],sets:0,noch:0,neu:0,btt:0,sudLog:[],sudLast:null,vocLast:null,vocPrev:null,bodyClear:false}}
const resetC=s=>{s.noch=0;s.neu=0;s.btt=0};
const setPlus=s=>{s.sets++};

/* ---------- שלבי הפרוטוקול ---------- */
const STEPS={
/* ===== שלב 1: תכנון טיפול ===== */
p1_problem:{phase:'1',title:'הבעיה',script:'[בוא|בואי] נדבר על הבעיה, או הנושא, שהביאה אותך לטיפול ושעליה נעבוד יחד. [ספר|ספרי] לי עוד על הבעיה.',
 input:{type:'text',key:'plan.problem',multi:true,to:'p1_examples'}},
p1_examples:{phase:'1',title:'חוויות עכשוויות',script:'אילו חוויות עכשוויות (1–3) ממחישות את הנושא או את הבעיה?',
 input:{type:'text',key:'plan.examples',multi:true,to:'p1_rep'}},
p1_rep:{phase:'1',title:'הדוגמה המייצגת',script:'איזו חוויה מהזמן האחרון, מבין אלה [שהזכרת|שהזכרת], היא המייצגת או המשמעותית ביותר עבורך כעת?',
 input:{type:'text',key:'plan.rep',to:'p1_method'}},
p1_method:{phase:'1',title:'איתור זיכרונות עבר',script:'בחירת דרך לאיתור זיכרונות עבר.',note:'Floatback מומלץ. אם עולה הצפה, אפשר לעבור לתשאול ישיר.',
 input:{type:'choice',rec:()=>0,opts:[{label:'Floatback',to:'p1_float'},{label:'תשאול ישיר',to:'p1_direct'},{label:'סריקת אפקט',to:'p1_affect'}]}},
p1_float:{phase:'1',title:'Floatback',script:'הייתי רוצה שנחזור לחוויה {REP}, שבחרנו כמייצגת את הבעיה.\nכש[אתה מחזיק|את מחזיקה] את החוויה הזו בראש: מה התמונה שמייצגת את החלק הקשה ביותר? איזו מחשבה שלילית עולה לך ביחס לעצמך? אילו רגשות [אתה חווה|את חווה]? איפה [אתה חש|את חשה] את זה בגוף?\nבזמן [שאתה מתמקד|שאת מתמקדת] בתמונה, במחשבה, ברגשות ובתחושות הגוף, [תן|תני] לעצמך לנוע אחורה, לזמנים מוקדמים יותר בחייך שבהם ייתכן [וחשת|וחשת] משהו דומה, ורק [שים|שימי] לב איזה זיכרון עולה.',
 note:'רישום התשובות לשאלות הראשונות, לפני הנסיעה אחורה בזמן.',
 input:{type:'fields',fields:[{key:'plan.fbImage',label:'תמונה (החלק הקשה ביותר)'},{key:'plan.fbNC',label:'מחשבה שלילית על עצמי'},{key:'plan.fbEmo',label:'רגשות'},{key:'plan.fbBody',label:'איפה בגוף'}],to:'p1_mem'}},
p1_direct:{phase:'1',title:'תשאול ישיר',script:'האם יש זיכרונות נוספים שגרמו לך להרגיש משהו דומה?\nהאם [אתה זוכר|את זוכרת] זמן מוקדם יותר בחייך שבו [חשת|חשת] משהו דומה?\nמתי [חווית|חווית] את זה לראשונה? מתי ואיך [למדת|למדת] את זה? מי לימד אותך את זה?',
 input:{type:'go',label:'רישום הזיכרונות שעלו',to:'p1_mem'}},
p1_affect:{phase:'1',title:'סריקת אפקט',script:'הייתי רוצה שנחזור לחוויה {REP}.\nכש[אתה מחזיק|את מחזיקה] את זה בראש, [שים|שימי] לב לרגשות שעולים בך כעת [ושים|ושימי] לב למה [שאתה חש|שאת חשה] בגוף. [תן|תני] לעצמך לסרוק זמן מוקדם יותר שייתכן [והרגשת|והרגשת] בו משהו דומה, ורק [שים|שימי] לב לזיכרון או לזיכרונות שעולים.',
 input:{type:'fields',fields:[{key:'plan.fbEmo',label:'רגשות'},{key:'plan.fbBody',label:'איפה בגוף'}],to:'p1_mem'}},
p1_mem:{phase:'1',title:'רישום זיכרונות עבר',script:'זיכרונות עבר שעלו, עם גיל או כיתה.',note:'לפני המעבר להווה ולעתיד: לסמן את ה-Touchstone (הראשון או המוקדם) ואת הזיכרון הקשה ביותר.',
 advice:()=>{const l=R.list;if(!l.length)return null;if(!l.some(m=>m.touch))return['warn','עדיין לא סומן זיכרון Touchstone.'];if(!l.some(m=>m.worst))return['warn','עדיין לא סומן הזיכרון הקשה ביותר.'];return null},
 input:{type:'list',key:'plan.memories',age:true,flags:true,ph:'תיאור קצר של הזיכרון',to:'p1_trig'}},
p1_trig:{phase:'1',title:'טריגרים בהווה',script:'כעת, נזהה מצבים, תנאים או אנשים בהווה שמהווים "טריגר" לסימפטומים שעמם [אתה מתמודד|את מתמודדת]: מחשבות שליליות, רגשות, תחושות גופניות, התנהגויות או הימנעויות.\nמהם הטריגרים [שידועים|שידועים] לך?',note:'נוסח מומלץ לרישום: "כל פעם ש___, אז ___".',
 input:{type:'list',key:'plan.triggers',ph:'כל פעם ש..., אז...',to:'p1_future'}},
p1_future:{phase:'1',title:'תבניות עתיד',script:'כעת, אבקש ממך לדמיין את עצמך בעתיד, [מתמודד|מתמודדת] בצורה יעילה עם הבעיה או עם מצב דומה. איך [היית רוצה|היית רוצה] להגיב?',note:'מחשבות, רגשות, תחושות גוף, התנהגויות.',
 input:{type:'list',key:'plan.future',ph:'מצב עתידי ותגובה רצויה',to:'p1_resHave'}},
p1_resHave:{phase:'1',title:'משאבים קיימים',script:'אילו תכונות אישיות מאפיינות אותך, שהן מקור חוזק עבורך? אילו אנשים, מקומות או דברים מהווים משאב יקר ערך עבורך, היום?',
 input:{type:'text',key:'plan.resHave',multi:true,to:'p1_resNeed'}},
p1_resNeed:{phase:'1',title:'משאבים נדרשים',script:'לאילו תכונות [אתה זקוק|את זקוקה], או [זקוק|זקוקה] ליותר מהן, כש[אתה חושב|את חושבת] על הבעיה [שאתה רוצה|שאת רוצה] לעבוד עליה?',note:'כל משאב שנרשם כאן יופיע כמועמד להתקנה ב-RDI.',
 input:{type:'list',key:'plan.resNeed',ph:'משאב (למשל: ביטחון, סבלנות)',to:'p1_ready'}},
p1_ready:{phase:'1',title:'מוכנות לעיבוד',script:'בדיקת מוכנות לפני בחירת טרגט ראשון.',
 advice:()=>{const n=(D.plan.resNeed||[]).length;if(!D.resources.length)return['warn','בבנק המשאבים אין עדיין מקום בטוח. מומלץ להתקין מקום/מצב בטוח לפני עיבוד.'];if(n>=3)return['warn',`נרשמו ${n} משאבים נדרשים. שקול/י הרחבת שלב 2 (RDI) לפני עיבוד.`];return['ok','קיים מקום בטוח בבנק המשאבים. אפשר להמשיך לבחירת טרגט.']},
 input:{type:'choice',rec:()=>D.resources.length&&(D.plan.resNeed||[]).length<3?0:1,opts:[{label:'המשך לבחירת טרגט ראשון',to:'p1_target'},{label:'קודם שלב 2: התקנת מקום/מצב בטוח',to:'@plan-p2'}]}},
p1_target:{phase:'1',title:'בחירת טרגט ראשון',script:'',note:'בחירת המטפל/ת: עם איזה זיכרון להמליץ להתחיל? לרוב מתחילים מה-Touchstone, אבל ההחלטה קלינית. במסך הבא ההמלצה מוצגת כתסריט למטופל/ת.',
 input:{type:'choice',rec:()=>Math.max(0,D.plan.memories.findIndex(m=>m.touch)),
  opts:()=>D.plan.memories.map((m,i)=>({label:(m.touch?'★ Touchstone · ':'')+(m.worst?'הכי קשה · ':'')+m.text+(m.age?` (גיל ${m.age})`:''),act:s=>{s.chosen=i},to:'p1_recommend'}))}},
p1_recommend:{phase:'1',title:'המלצה למטופל/ת',script:'הייתי רוצה להציע שנתחיל לעבוד עם הזיכרון {CHOSEN}. מה [אתה חושב|את חושבת] על זה?',
 input:{type:'choice',rec:()=>0,opts:[{label:'המטופל/ת מסכים/ה',to:'p1_tname'},{label:'בחירת זיכרון אחר',to:'p1_target'}]}},
p1_tname:{phase:'1',title:'כינוי לזיכרון',script:'כדי שנוכל להתייחס לזיכרון הזה יותר מאוחר, הייתי רוצה להציע [שתיתן|שתתני] לזיכרון הזה כינוי.',note:'את הכינוי נותן/ת המטופל/ת. הוא יושתל בתסריטים של הפגישות הבאות.',
 input:{type:'text',key:'s.tname',ph:'הכינוי, במילים של המטופל/ת',to:'p1_end'}},
p1_end:{phase:'1',title:'סיום',script:'לסיום: חזרה למקום/מצב הבטוח, או טכניקת ויסות והרגעה חלופית, לפי הצורך.',
 input:{type:'choice',opts:[{label:'שמירת התוכנית וחזרה לתיק',to:'@plan-done'}]}},

/* ===== שלב 2: הכנה וייצוב ===== */
p2_start:{phase:'2',title:'הכנה וייצוב',script:'מה נעשה היום?',
 input:{type:'choice',opts:[{label:'הסבר AIP והדגמת BLS (מטופל/ת חדש/ה)',to:'p2_aip'},{label:'התקנת מקום/מצב בטוח',to:'p2_kind'}]}},
p2_aip:{phase:'2',title:'הסבר על EMDR',script:'כשאנחנו חווים אירוע מעורר מצוקה, הוא עלול להינעל במוח שלנו, יחד עם המראות, הצלילים, המחשבות, הרגשות ותחושות הגוף שאפיינו את האירוע. ככל הנראה, EMDR מעורר את המידע באופן שמאפשר למוח לעבד את האירוע. ייתכן שזה דומה למה שקורה בזמן שאנו חולמים, בשנת REM. תנועות העיניים, טפיפות או צלילים, עשויים לסייע לעבד את החומרים מזמן האירוע.\nחשוב [שתזכור|שתזכרי] שהמוח שלך יניע את תהליך הריפוי, [ואתה זה|ואת זו] שבשליטה על מה שקורה.',
 note:'במצבים חוזרים אין צורך בהסבר.',input:{type:'go',label:'להדגמת BLS',to:'p2_blsdemo'}},
p2_blsdemo:{phase:'2',title:'הדגמת BLS',bls:'fast',script:'[הרשה|הרשי] לי להדגים בפניך איך אנחנו יכולים לעשות את הגירוי הבי-לטרלי.',note:'מרחק נוח מהפנים, מהירות, כיוון (אופקי או אלכסוני). ההעדפה תישמר בתיק.',
 input:{type:'choice',opts:[
  {label:'תנועות עיניים',act:()=>{D.client.bls.type='תנועות עיניים'},to:'p2_meta'},
  {label:'טאפינג',act:()=>{D.client.bls.type='טאפינג'},to:'p2_meta'},
  {label:'גירוי שמיעתי',act:()=>{D.client.bls.type='גירוי שמיעתי'},to:'p2_meta'}]}},
p2_meta:{phase:'2',title:'מטאפורה',script:'על-מנת לעזור לך "פשוט לשים לב" לזיכרון ולמה שעולה, [דמיין|דמייני] [שאתה נוסע|שאת נוסעת] ברכבת, או [צופה|צופה] בסרט, כאשר התמונות, הרגשות והמחשבות פשוט עוברים לידך.',
 input:{type:'go',label:'לסימן עצירה',to:'p2_stop'}},
p2_stop:{phase:'2',title:'סימן עצירה',script:'אם [תרגיש|תרגישי] [שאתה רוצה|שאת רוצה] לעצור מאיזושהי סיבה, בכל שלב, פשוט [הרם|הרימי] את היד שלך. או: [הראה|הראי] לי סימן לא מילולי [שתעשה|שתעשי] בו שימוש אם [תצטרך|תצטרכי] לעצור.',
 input:{type:'text',key:'client.stop',ph:'למשל: יד מורמת',to:'p2_kind'}},
p2_kind:{phase:'2',title:'מקום או מצב',script:'בחירת נוסח אחד בהתאם לצורך המטופל.',
 input:{type:'choice',opts:[{label:'מקום',act:s=>{s.kind='מקום בטוח'},to:'p2_place'},{label:'מצב (חושי)',act:s=>{s.kind='מצב רגוע'},to:'p2_state'}]}},
p2_place:{phase:'2',title:'תמונה: מקום',script:'אנא [העלה|העלי] חוויה [שחווית|שחווית], או מקום [שהיית|שהיית] בו, או [שאתה יכול|שאת יכולה] לדמיין [שאתה|שאת] שם, מקום שמרגיש רגוע, או בטוח. אולי זה בחוף הים, או בהרים, או בזמן פעילות [שאתה נהנה|שאת נהנית] ממנה.\nאיזו תמונה מייצגת את המקום הזה? אנא [תאר|תארי] את מה [שאתה רואה|שאת רואה].',
 input:{type:'text',key:'s.image',ph:'התמונה במילים של המטופל/ת',to:'p2_emo'}},
p2_state:{phase:'2',title:'תמונה: מצב',script:'אנא [העלה|העלי] תמונה, או [התחבר|התחברי] לרגע חושי אחר (ריח, צליל) שנותן לך תחושה של ביטחון ורגיעה.\nמה עולה? אנא [תאר|תארי] את מה [שאתה רואה|שאת רואה].',
 input:{type:'text',key:'s.image',to:'p2_emo'}},
p2_emo:{phase:'2',title:'רגשות ותחושות',script:'כש[אתה מעלה|את מעלה] את החוויה הזו עכשיו, [שים|שימי] לב למה [שאתה רואה, שומע וחש|שאת רואה, שומעת וחשה].\nאילו רגשות עולים בך? אילו תחושות עולות בגופך?',
 input:{type:'text',key:'s.emotions',to:'p2_enh'}},
p2_enh:{phase:'2',title:'העצמה',script:'[התמקד|התמקדי] בזה [ושים|ושימי] לב למראות, צלילים, ריחות ותחושות.\n[ספר|ספרי] לי עוד על מה [שאתה חווה|שאת חווה] כעת.',
 input:{type:'go',label:'לגירוי בי-לטרלי',to:'p2_bls'}},
p2_bls:{phase:'2',title:'גירוי בי-לטרלי',bls:'slow',script:'אנא [העלה|העלי] את {IMG} [והתמקד|והתמקדי] במה [שאתה מרגיש|שאת מרגישה] ואיפה [אתה מרגיש|את מרגישה] את התחושות הנעימות בגוף, [ואפשר|ואפשרי] לעצמך להנות מהן. [התמקד|התמקדי] ברגשות ובתחושות האלו, [ועקוב|ועקבי] אחרי האצבעות שלי.\n\nלמה [אתה שם|את שמה] לב עכשיו?',
 note:'4–8 passes איטיים (הלוך-חזור). סט קצר.',
 input:{type:'choice',opts:[{label:'חיובי',act:setPlus,to:'p2_pos'},{label:'שלילי',act:setPlus,to:'p2_neg'}]}},
p2_pos:{phase:'2',title:'חיזוק',bls:'slow',script:'[התמקד|התמקדי] בזה.\n\nלמה [אתה שם|את שמה] לב עכשיו?',note:'עד 4 סטים, לפי הצורך.',
 advice:s=>s.sets>4?['warn',`בוצעו ${s.sets} סטים. בהתקנת משאב מומלץ לא לעבור 4 סטים קצרים; סטים רבים עלולים לפתוח עיבוד.`]:null,
 input:{type:'choice',rec:s=>s.sets<3?0:1,opts:[{label:'מתחזק: עוד סט קצר',act:setPlus,to:'p2_pos'},{label:'יציב: לסימן מילולי',to:'p2_cue'}]}},
p2_neg:{phase:'2',title:'תגובה שלילית',script:'[הזז|הזיזי] את תשומת הלב מהתמונה או מהחוש, [שים|שימי] בצד חלקים שליליים [וחזור|וחזרי] להתמקד בחיובי, במידת האפשר.',
 input:{type:'choice',opts:[{label:'הצליח/ה להתחבר: "התמקד/י בזה" + BLS',act:setPlus,to:'p2_pos'},{label:'לא הצליח/ה להתחבר',to:'p2_alt'}]}},
p2_alt:{phase:'2',title:'חלופות',script:'המטופל/ת לא מצליח/ה להתחבר.',
 advice:()=>['warn','אפשר לחפש מקום/מצב אחר, בטוח או רגוע, תוך שימת לב שאין בו אסוציאציות לאנשים. או לעבור לתרגיל חלופי של ויסות רגשי.'],
 input:{type:'choice',opts:[{label:'חיפוש מקום/מצב אחר',act:s=>{s.sets=0},to:'p2_kind'},{label:'מעבר לתרגיל ויסות חלופי (סיום)',to:'@home'}]}},
p2_cue:{phase:'2',title:'סימן מילולי',script:'האם יש מילה או משפט שמייצגים את התמונה או את החוש?',
 input:{type:'text',key:'s.cue',ph:'מילה או משפט',to:'p2_cuebls'}},
p2_cuebls:{phase:'2',title:'חיזוק הסימן המילולי',bls:'slow',script:'[חשוב|חשבי] על {CUE} [ושים|ושימי] לב לרגשות ולתחושות שעולים בך כש[אתה מעלה|את מעלה] את המילה הזו. [התמקד|התמקדי] בתחושות האלו ובמילה {CUE}, [ועקוב|ועקבי] אחרי האצבעות שלי.\n\nלמה [אתה שם|את שמה] לב עכשיו?',
 note:'4–8 passes. ממשיכים כל עוד החוויה החיובית ממשיכה להתחזק.',
 input:{type:'choice',opts:[{label:'מתחזק: עוד סט',act:setPlus,to:'p2_cuebls'},{label:'יציב: לסימן עצמי',act:setPlus,to:'p2_self'}]}},
p2_self:{phase:'2',title:'סימן מילולי עצמי',script:'כעת, [אמור|אמרי] {CUE} [ושים|ושימי] לב למה [שאתה חווה|שאת חווה].',
 note:'מכאן והלאה ללא BLS.',input:{type:'go',label:'לסימן עם הפרעה',to:'p2_dist'}},
p2_dist:{phase:'2',title:'סימן מילולי עם הפרעה',script:'כעת, [דמיין|דמייני] מטרד קטן. לא מה שהביא אותך לטיפול, אלא מטרד קטן, אולי משהו שעצבן אותך הבוקר בדרך לכאן (רמת מצוקה של 1–2 מתוך 10), [ושים|ושימי] לב איך [אתה מרגיש|את מרגישה].\n[העלה|העלי] את המילה {CUE}, [ושים|ושימי] לב אם יש שינוי בחוויה שלך.\n\nלמה [אתה שם|את שמה] לב?',
 input:{type:'choice',opts:[{label:'חזר/ה לחוויה החיובית',to:'p2_selfdist'},{label:'קשה לחזור',to:'p2_distfail'}]}},
p2_distfail:{phase:'2',title:'קשה לחזור',script:'',advice:()=>['warn','חזרה לחיזוק הסימן המילולי עם BLS, ואחר כך ניסיון חוזר עם מטרד קטן יותר.'],
 input:{type:'choice',opts:[{label:'חזרה לחיזוק הסימן עם BLS',to:'p2_cuebls'}]}},
p2_selfdist:{phase:'2',title:'סימן עצמי עם הפרעה',script:'כעת, [דמיין|דמייני] מטרד טיפה יותר משמעותי (מצוקה של 2–3 מתוך 10) [ושים|ושימי] לב איך [אתה מרגיש|את מרגישה].\n[שים|שימי] לב מה [אתה מרגיש|את מרגישה], ואז [העלה|העלי] את המילה {CUE} בעצמך, [ושים|ושימי] לב במיוחד אם ישנם שינויים בגוף שלך.',
 input:{type:'choice',opts:[{label:'הצליח/ה: שמירה לבנק המשאבים',to:'@res-save'},{label:'לא הצליח/ה',to:'p2_distfail'}]}},

/* ===== שלבים 3–7 ===== */
p3_tgt:{phase:'3',title:'בחירת טרגט',script:'',note:'בחירת המטפל/ת. הכינוי שניתן לזיכרון יושתל בתסריט במסך הבא.',
 input:{type:'choice',rec:()=>{const t=D.targets.filter(t=>t.status!=='הושלם');const i=t.findIndex(x=>x.status==='בעיבוד'||x.status==='הבא בתור');return i<0?0:i},
  opts:()=>D.targets.filter(t=>t.status!=='הושלם').map(t=>({label:`${t.name} · ${t.kind} · ${t.status}`,act:s=>{s.target=t.name},to:'p3_open'}))}},
p3_open:{phase:'3',title:'פתיחה',script:'החלטנו לעבד מחדש את הזיכרון {TGT}, כדי לעזור לך עם {PROBLEM}.',
 input:{type:'go',label:'להוראות',to:'p3_instr'}},
p3_instr:{phase:'3',title:'הוראות ספציפיות',script:'אחרי שנעלה את הזיכרון, נעשה סטים של {BLS}. בין הסטים, אבדוק מה קורה איתך כדי להבין מה [אתה חווה|את חווה]. אנא [שתף|שתפי] אותי במה [שאתה שם|שאת שמה] לב אליו בכל פעם שנעצור.\nלעיתים דברים ישתנו, ולעיתים לא. אין משהו ש"חייב" לקרות בתהליך הזה. אז רק [תן|תני] לי את המשוב הכי מהימן לגבי מה שקורה, בלי לשפוט אם משהו צריך לקרות או לא. [תן|תני] למה שקורה, לקרות.\n[זכור|זכרי], יש לך את סימן העצירה: {STOPSIGN}.',
 input:{type:'go',label:'לשלב 3: הערכה',to:'p3_img'}},
p3_img:{phase:'3',title:'תמונה',script:'איזו תמונה מייצגת את החלק הקשה ביותר של החוויה, כש[אתה חושב|את חושבת] עליה, עכשיו?',
 note:'אם אין תמונה: "כש[אתה מעלה|את מעלה] את החוויה, מה החלק הכי קשה, עכשיו?"',
 input:{type:'text',key:'s.image',to:'p3_nc'}},
p3_nc:{phase:'3',title:'אמונה שלילית (NC)',script:'אילו מילים, אשר מייצגות אמונה שלילית לגבי עצמך, הולכות הכי טוב ביחד עם התמונה הזו, עכשיו?',
 note:'במידת הצורך: "מה זה אומר [עליך|עלייך] [כבן-אדם|כבת-אדם], עכשיו?"',input:{type:'nc',to:'p3_pc'}},
p3_pc:{phase:'3',title:'אמונה חיובית (PC)',script:'כש[אתה מעלה|את מעלה] את התמונה, או את החוויה, הזו, מה [היית מעדיף|היית מעדיפה] להאמין על עצמך?',
 note:'ההצעה מטבלת האמונות מולאה מראש. כדאי להשתמש במילים של המטופל/ת.',
 input:{type:'text',key:'s.pc',def:s=>s.pcSug?G(s.pcSug):'',to:'p3_voc'}},
p3_voc:{phase:'3',title:'תוקף האמונה החיובית (VOC)',script:'כש[אתה מעלה|את מעלה] את התמונה (או את החלק הכי קשה), כמה המילים {PC} מרגישות לך נכונות עכשיו, על סקאלה מ-1 עד 7, כאשר 1 מרגיש בכלל לא נכון, ו-7 מרגיש הכי נכון?',
 input:{type:'scale',key:'s.voc0',min:1,max:7,lo:'1 · בכלל לא נכון',hi:'7 · הכי נכון',to:()=>'p3_emo'}},
p3_emo:{phase:'3',title:'רגשות',script:'כש[אתה מעלה|את מעלה] את התמונה הזו, יחד עם המילים {NC}, אילו רגשות עולים בך, עכשיו?',
 input:{type:'text',key:'s.emotions',to:'p3_sud'}},
p3_sud:{phase:'3',title:'רמת המצוקה (SUD)',script:'על סקאלה מ-0 עד 10, כאשר 0 פירושו שאין מצוקה או ניטרלי, ו-10 זה רמת המצוקה הכי גבוהה [שאתה יכול|שאת יכולה] לדמיין, מהי רמת המצוקה [שאתה חש|שאת חשה], עכשיו?',
 input:{type:'scale',key:'s.sud0',min:0,max:10,lo:'0 · ללא מצוקה',hi:'10 · הכי גבוהה',after:(s,v)=>{s.sudLast=v;s.sudLog=[v]},to:()=>'p3_body'}},
p3_body:{phase:'3',title:'תחושות גוף',script:'איפה [אתה מרגיש|את מרגישה] את זה בגוף שלך?',
 input:{type:'text',key:'s.body',to:'p4_start'}},
p4_start:{phase:'4',title:'תחילת עיבוד',bls:'fast',script:'אבקש ממך להעלות את התמונה הזאת, את המילים השליליות {NC}, [שים|שימי] לב איפה [אתה מרגיש|את מרגישה] את זה בגוף, [תן|תני] לזה ללכת לאן שזה צריך ללכת, [ועקוב|ועקבי] אחרי האצבעות שלי.',
 input:{type:'go',label:'סט ראשון בוצע',act:setPlus,to:'p4_set'}},
p4_cont:{phase:'4',title:'המשך עיבוד מנקודת העצירה',bls:'fast',script:'[העלה|העלי] את הזיכרון, יחד עם הרגשות ותחושות הגוף [שאתה חווה|שאת חווה] כעת, [ותן|ותני] לזה ללכת לאן שזה צריך ללכת בזמן [שאתה מתחיל|שאת מתחילה] עם תנועות העיניים.',
 input:{type:'go',label:'סט ראשון בוצע',act:setPlus,to:'p4_set'}},
p4_set:{phase:'4',title:'עיבוד',bls:'fast',script:'[שחרר|שחררי], [קח|קחי] נשימה. למה [אתה שם|את שמה] לב עכשיו?',
 note:'אחרי התשובה: "[לך|לכי] עם זה." וסט נוסף. 20–30 passes, או לפי הצורך.',
 advice:s=>{if(s.noch>=2)return['ok','אין שינוי בשני סטים רצופים. הפרוטוקול: חזרה לטרגט.'];
  if(s.neu>=2)return['ok','אסוציאציות ניטרליות/חיוביות בסטים רצופים. הפרוטוקול: חזרה לטרגט.'];
  if(s.sets>=25)return['warn',`${s.sets} סטים בפגישה. אם החומר חוזר על עצמו, ייתכן עיבוד תקוע (לופינג): שקול/י אסטרטגיות לעיבוד תקוע.`];return null},
 input:{type:'choice',said:true,rec:s=>(s.noch>=2||s.neu>=2)?3:null,opts:[
  {label:'שינוי / מידע חדש: "לך/י עם זה"',act:s=>{s.sets++;s.noch=0;s.neu=0},to:'p4_set'},
  {label:'אין שינוי',act:s=>{s.sets++;s.noch++;s.neu=0},to:'p4_set'},
  {label:'ניטרלי / חיובי / עמום',act:s=>{s.sets++;s.neu++;s.noch=0},to:'p4_set'},
  {label:'חזרה לטרגט',act:s=>{s.btt=0},to:'p4_btt'}]}},
p4_btt:{phase:'4',title:'חזרה לטרגט',bls:'fast',script:'כש[אתה מעלה|את מעלה] את הזיכרון, כמו [שאתה חווה|שאת חווה] אותו עכשיו, למה [אתה שם|את שמה] לב?',
 note:'אחרי התשובה: "[לך|לכי] עם זה." וסט BLS.',
 advice:s=>s.btt>=2?['ok','ניטרלי אחרי שני סטים רצופים מהטרגט. הפרוטוקול: בדיקת SUD.']:null,
 input:{type:'choice',said:true,rec:s=>s.btt>=2?2:null,opts:[
  {label:'עולה חומר חדש: המשך עיבוד',act:s=>{s.sets++;resetC(s)},to:'p4_set'},
  {label:'ניטרלי / אין שינוי / "כלום"',act:s=>{s.sets++;s.btt++},to:'p4_btt'},
  {label:'בדיקת SUD',to:'p4_sud'}]}},
p4_sud:{phase:'4',title:'בדיקת SUD',skip:'p4_set',script:'כש[אתה מעלה|את מעלה] את הזיכרון כמו [שאתה חווה|שאת חווה] אותו עכשיו, על סקאלה מ-0 עד 10, כאשר 0 פירושו שאין מצוקה או ניטרלי, ו-10 זה רמת המצוקה הכי גבוהה [שאתה יכול|שאת יכולה] לדמיין, כמה מצוקה זה מעורר בך עכשיו?',
 input:{type:'scale',key:'s.sudLast',min:0,max:10,lo:'0 · ללא מצוקה',hi:'10 · הכי גבוהה',after:(s,v)=>{s.sudLog.push(v);resetC(s)},to:v=>v>=3?'p4_high':v>=1?'p4_low':'p4_zero'}},
p4_high:{phase:'4',title:'SUD גבוה מ-2',script:'[לך|לכי] עם זה.',
 advice:s=>{const L=s.sudLog;const stuck=L.length>=3&&L[L.length-1]>=L[L.length-3];return stuck?['warn',`SUD לא יורד (${L.slice(-3).join(' → ')}). שקול/י: אמונה חוסמת, זיכרון מזין (Feeder), או אסטרטגיות לעיבוד תקוע.`]:['ok',`SUD ${s.sudLast}: ממשיכים בעיבוד.`]},
 input:{type:'choice',rec:()=>0,opts:[{label:'המשך עיבוד',act:setPlus,to:'p4_set'},{label:'SUD אקולוגי: מעבר לשלב 5',to:'p5_pc'}]}},
p4_low:{phase:'4',title:'SUD 1–2',bls:'fast',script:'היכן [אתה חש|את חשה] את זה בגוף שלך? [לך|לכי] עם זה.',
 input:{type:'choice',said:true,opts:[{label:'שינוי / מידע חדש: המשך עיבוד',act:setPlus,to:'p4_set'},{label:'בדיקת SUD חוזרת',act:setPlus,to:'p4_sud'},{label:'SUD אקולוגי: מעבר לשלב 5',to:'p5_pc'}]}},
p4_zero:{phase:'4',title:'SUD = 0',bls:'fast',script:'[לך|לכי] עם זה.\n\nלמה [אתה שם|את שמה] לב עכשיו?',note:'לפחות סט אחד נוסף לאישור, לפני המעבר לשלב 5.',
 input:{type:'choice',said:true,rec:()=>0,opts:[{label:'נשאר 0 / ניטרלי: מעבר לשלב 5',act:setPlus,to:'p5_pc'},{label:'עלה חומר חדש',act:setPlus,to:'p4_set'}]}},
p5_pc:{phase:'5',title:'התקנת האמונה החיובית',script:'כש[אתה מעלה|את מעלה] את הזיכרון, האם המילים {PC} עדיין מתאימות? או שישנן מילים אחרות שמתאימות יותר?',
 input:{type:'choice',opts:[{label:'עדיין מתאימות',to:'p5_voc'},{label:'מילים אחרות',to:'p5_pcnew'}]}},
p5_pcnew:{phase:'5',title:'PC מעודכן',script:'אילו מילים מתאימות יותר?',input:{type:'text',key:'s.pc',to:'p5_voc'}},
p5_voc:{phase:'5',title:'בדיקת VOC',skip:'p5_set',script:'[העלה|העלי] את הזיכרון, יחד עם המילים {PC}. מ-1 (בכלל לא נכון) עד 7 (הכי נכון), כמה הן מרגישות לך נכונות עכשיו?',
 input:{type:'scale',key:'s.vocLast',min:1,max:7,lo:'1 · בכלל לא נכון',hi:'7 · הכי נכון',before:s=>{s.vocPrev=s.vocLast},to:()=>'p5_set'}},
p5_set:{phase:'5',title:'חיזוק',bls:'fast',script:'[החזק|החזיקי] את הזיכרון יחד עם המילים {PC}.\n\n[שחרר|שחררי], [קח|קחי] נשימה. למה [אתה שם|את שמה] לב עכשיו? [שים|שימי] לב לזה.',
 note:'סט BLS, ואחריו בדיקת VOC חוזרת, עד שה-VOC מפסיק להתחזק.',
 advice:s=>{if(s.vocLast===7)return['ok','VOC=7. סט נוסף ובדיקה; כשהוא לא מתחזק עוד: שלב 6.'];
  if(s.vocPrev!=null&&s.vocLast<=s.vocPrev&&s.vocLast<=6)return['warn',`VOC ${s.vocLast} ולא מתחזק. לבדוק התאמת PC ואמונה חוסמת: "מה מונע מזה להיות 7?"`];return null},
 input:{type:'choice',rec:s=>s.vocLast===7?1:(s.vocPrev!=null&&s.vocLast<=s.vocPrev)?2:0,opts:[
  {label:'בדיקת VOC חוזרת',act:setPlus,to:'p5_voc'},
  {label:'VOC=7 (או אקולוגי) ולא מתחזק: שלב 6',act:setPlus,to:'p6'},
  {label:'VOC 6 ומטה ולא מתחזק',to:'p5_block'}]}},
p5_block:{phase:'5',title:'אמונה חוסמת',script:'מה מונע מזה להיות 7?',input:{type:'text',key:'s.block',to:'p5_blockc'}},
p5_blockc:{phase:'5',title:'אמונה חוסמת',script:'',advice:()=>['warn','אם הזמן אוזל, אפשר להניח את האמונה החוסמת בצד לפגישה הבאה ולעבור לסגירת עיבוד שלא הושלם.'],
 input:{type:'choice',opts:[{label:'עיבוד האמונה החוסמת (חזרה לשלב 4)',act:resetC,to:'p4_set'},{label:'הזמן אוזל: סגירה',act:s=>{s.forceInc=true},to:'p7'}]}},
p6:{phase:'6',title:'סריקת גוף',script:'[עצום|עצמי] את עינייך, תוך כדי מתן תשומת לב לזיכרון המקורי ולמילים {PC}. [העבר|העבירי] את תשומת הלב שלך לכל חלקי גופך, [התחל|התחילי] מהראש [והתקדם|והתקדמי] מטה. אם [אתה שם|את שמה] לב למתח, כיווץ, או כל תחושה יוצאת דופן, [ספר|ספרי] לי על כך.',
 input:{type:'choice',opts:[{label:'גוף נקי / ניטרלי',act:s=>{s.bodyClear=true},to:'p7'},{label:'תחושה חיובית / נוחה',act:s=>{s.bodyClear=true},to:'p6_pos'},{label:'אי-נוחות',to:'p6_set'}]}},
p6_pos:{phase:'6',title:'חיזוק תחושה חיובית',bls:'fast',script:'[התמקד|התמקדי] בתחושה הזו.',note:'סטים של BLS לחיזוק.',
 input:{type:'go',label:'לסגירה',act:setPlus,to:'p7'}},
p6_set:{phase:'6',title:'עיבוד אי-נוחות',bls:'fast',script:'[התמקד|התמקדי] בתחושה. [לך|לכי] עם זה.',note:'סטים של BLS עד שאי-הנוחות חולפת, ואז סריקה חוזרת.',
 input:{type:'choice',opts:[{label:'חלפה: סריקה חוזרת',act:setPlus,to:'p6'},{label:'לא חולפת / עולה חומר חדש',act:setPlus,to:'p6_stuck'}]}},
p6_stuck:{phase:'6',title:'אי-נוחות שלא חולפת',script:'',advice:()=>['warn','ייתכן שהתחושה קשורה לחומר שעדיין לא עובד. חזרה לעיבוד, או סגירת עיבוד שלא הושלם אם הזמן אוזל.'],
 input:{type:'choice',opts:[{label:'חזרה לעיבוד (שלב 4)',act:resetC,to:'p4_set'},{label:'סגירה',act:s=>{s.forceInc=true},to:'p7'}]}},
p7:{route:s=>{s.complete=!s.forceInc&&s.sudLast===0&&s.vocLast===7&&s.bodyClear;return s.complete?'p7_com':'p7_inc'}},
p7_inc:{phase:'7',title:'סגירת עיבוד שלא הושלם',script:'כמעט נגמר לנו הזמן, ונצטרך לסיים. תודה על המאמץ [שעשית|שעשית] היום.\n\nאיך [אתה מרגיש|את מרגישה]?',
 advice:()=>['warn','אין לבצע עכשיו בדיקת SUD, VOC או סריקת גוף: הן עלולות להפעיל עיבוד.'],
 input:{type:'choice',opts:[{label:'צורך בהכלה: תרגיל מיכל',to:'p7_cont'},{label:'צורך ברגיעה: מקום בטוח',to:'p7_safe'},{label:'יציב/ה',to:'p7_reflect'}]}},
p7_cont:{phase:'7',title:'תרגיל מיכל',script:'הייתי רוצה להציע שנעשה תרגיל ליצירת תחושת הכלה לפני שנעצור. הייתי רוצה לבקש ממך לדמיין [שאתה לוקח|שאת לוקחת] את מה שנשאר מהחוויה הזו [ושם|ושמה] אותו בתוך מיכל לבחירתך, עד הפגישה הבאה שלנו.',
 input:{type:'go',label:'המשך',act:s=>{s.stab='מיכל'},to:'p7_reflect'}},
p7_safe:{phase:'7',title:'מקום בטוח',script:'[העלה|העלי] את {RES}. [אמור|אמרי] לעצמך {CUE}, [ושים|ושימי] לב למה [שאתה חווה|שאת חווה].',
 input:{type:'go',label:'המשך',act:s=>{s.stab='מקום בטוח'},to:'p7_reflect'}},
p7_com:{phase:'7',title:'סגירת עיבוד שהושלם',script:'[עשית|עשית] עבודה טובה מאוד היום. איך [אתה מרגיש|את מרגישה]?',
 advice:()=>['ok','העיבוד הושלם: SUD=0, VOC=7, סריקת גוף נקייה.'],input:{type:'go',label:'המשך',to:'p7_reflect'}},
p7_reflect:{phase:'7',title:'משוב',script:'',scriptFn:s=>s.complete?'כש[אתה חושב|את חושבת] על החוויה שלך כאן היום, מה היה הכי משמעותי או יעיל עבורך, או מה [למדת|למדת] או [הרווחת|הרווחת]?':'כש[אתה חושב|את חושבת] על החוויה שלך כאן היום, איזה משפט חיובי יכול לבטא את מה [שאתה מרגיש|שאת מרגישה], או מה [למדת|למדת] או [הרווחת|הרווחת]?',
 note:'ללא BLS.',input:{type:'text',key:'s.reflect',to:'p7_instr'}},
p7_instr:{phase:'7',title:'הוראות לסגירת מפגש',script:'העיבוד שעשינו עשוי להמשיך לאחר הפגישה. ייתכן [ותשים|ותשימי] לב לתובנות, מחשבות, זכרונות, תחושות גופניות, או חלומות חדשים. [רשום|רשמי] את מה [שאתה שם|שאת שמה] לב אליו. נדבר על כך בפגישתנו הבאה. [זכור|זכרי] לעשות שימוש באחת הטכניקות שלמדנו להרגעה וויסות, במידת הצורך.',
 input:{type:'go',label:'לרישום הערות',to:'p7_notes'}},
p7_notes:{phase:'7',title:'הערות למטפל/ת',script:'נושאים או אסוציאציות שעלו בעיבוד, שיש לחזור ולהעריך מחדש בהמשך.',note:'יוצג בפתיחת שלב 8 בפגישה הבאה.',
 input:{type:'text',key:'s.notes',multi:true,to:'@finish'}},

/* ===== שלב 8 ===== */
p8_open:{phase:'8',title:'הערכה מחודשת: הנושא',script:'ביחס לנושא {PROBLEM} שאנחנו עובדים עליו, [ספר|ספרי] לי: למה [שמת|שמת] לב, שהוא חדש, או שונה בחייך, מאז המפגש האחרון שלנו?\nאיך עבר השבוע? האם [שמת|שמת] לב לשינויים במחשבות, רגשות, חלומות או התנהגויות שלך?',
 input:{type:'text',key:'s.changes',multi:true,to:'p8_new'}},
p8_new:{phase:'8',title:'זיכרונות ותובנות חדשים',script:'האם יש לך זכרונות חדשים או תובנות כש[אתה חושב|את חושבת] על הנושא הזה היום?',
 input:{type:'choice',opts:[{label:'כן: עלו זיכרונות חדשים',to:'p8_mem'},{label:'לא',to:'p8_tgt'}]}},
p8_mem:{phase:'8',title:'זיכרונות חדשים',script:'רישום הזיכרונות שעלו.',note:'כל זיכרון ייכנס לתוכנית הטיפול כטרגט מועמד.',
 input:{type:'list',key:'s.newMems',age:true,ph:'תיאור קצר',to:'@p8-addmem'}},
p8_tgt:{phase:'8',title:'הערכה מחודשת: הטרגט',script:'כש[אתה מעלה|את מעלה] את הזיכרון של {TGT}, שעבדנו עליו בפגישתנו האחרונה, למה [אתה שם|את שמה] לב עכשיו?',
 note:'במידת הצורך: "מה השתנה או שונה ביחס לחוויה? תובנות או מחשבות חדשות?"',
 input:{type:'text',key:'s.notice',multi:true,to:'p8_sud'}},
p8_sud:{phase:'8',title:'SUD עכשווי',script:'כש[אתה מעלה|את מעלה] את האירוע {TGT} כמו [שאתה חווה|שאת חווה] אותו עכשיו, על סקאלה מ-0 עד 10, כמה מצוקה זה מעורר בך עכשיו?',
 input:{type:'scale',key:'s.sud8',min:0,max:10,lo:'0 · ללא מצוקה',hi:'10 · הכי גבוהה',to:v=>p8Route(v)}},
p8r_img:{phase:'8',title:'עירור הזיכרון: תמונה',script:'[העלה|העלי] את הזיכרון {TGT} שעבדנו עליו. איזו תמונה מייצגת את החלק הכי קשה בחוויה, כש[אתה חושב|את חושבת] על זה עכשיו?',
 note:'אם אין תמונה: "כש[אתה מעלה|את מעלה] את החוויה, מהו החלק הכי גרוע עכשיו?"\nהתמונה מהפגישה הקודמת מולאה מראש; אפשר לעדכן לפי התשובה.',
 advice:s=>['ok',`SUD ${s.sud8}: לפני חזרה לעיבוד מעוררים את הזיכרון בארבע שאלות (תמונה, רגשות, SUD, מיקום בגוף), ואז ממשיכים בשלב 4.`],
 input:{type:'text',key:'s.image',to:'p8r_emo'}},
p8r_emo:{phase:'8',title:'עירור הזיכרון: רגשות',script:'אילו רגשות [אתה מרגיש|את מרגישה] עכשיו?',
 input:{type:'text',key:'s.emotions',to:'p8r_sud'}},
p8r_sud:{phase:'8',title:'עירור הזיכרון: SUD',skip:'p8r_body',script:'בסולם של 0 עד 10, כאשר 0 מייצג מצב ניטרלי או לא מטריד בכלל, ו-10 הכי מטריד [שהיית יכול|שהיית יכולה] לדמיין, כמה הזיכרון מטריד אותך עכשיו?',
 input:{type:'scale',key:'s.sudR',min:0,max:10,lo:'0 · ניטרלי',hi:'10 · הכי מטריד',to:()=>'p8r_body'}},
p8r_body:{phase:'8',title:'עירור הזיכרון: מיקום בגוף',script:'איפה בגוף [אתה חש|את חשה] את זה?',
 input:{type:'text',key:'s.body',to:'@resume:p4_cont'}},
p8_to5:{phase:'8',title:'מעבר לשלב 5',script:'',
 advice:()=>{const L=lastS();return['ok',`SUD=0, ו-VOC ${L.vocEnd==null?'לא נבדק':`היה ${L.vocEnd}`} בפגישה הקודמת. עוברים לשלב 5 (התקנה) כדי לקשר בין המחשבה החיובית לזיכרון, וממשיכים בכל השלבים כולל סריקת גוף.`]},
 input:{type:'choice',rec:()=>0,opts:[{label:'מעבר לשלב 5: התקנת ה-PC',to:'@resume:p5_pc'}]}},
p8_to6:{phase:'8',title:'מעבר לשלב 6',script:'',
 advice:()=>['ok','SUD=0 ו-VOC=7, אבל סריקת הגוף לא הייתה נקייה. עוברים ישר לשלב 6.'],
 input:{type:'choice',rec:()=>0,opts:[{label:'מעבר לשלב 6: סריקת גוף',to:'@resume:p6'}]}},
p8_closed:{phase:'8',title:'הטרגט עבר עיבוד במלואו',script:'',
 advice:()=>['ok','SUD=0, VOC=7, סריקת גוף נקייה. לפי "שיקולים לגבי תוכנית טיפול": קובעים מה הזיכרון הבא שיעבור עיבוד (שלבים 3–6). אפשר להמשיך בשלישייה: טריגר בהווה הקשור, תבנית עתיד, או הטרגט הבא בתוכנית.'],
 input:{type:'choice',opts:[{label:'התחלת עיבוד לטרגט הבא',to:'@p8-next'},{label:'חזרה לתיק',to:'@home'}]}},
};
function p8Route(v){
  const L=lastS();
  if(v==null||v>0)return'p8r_img';
  if(L.complete)return'p8_closed';
  if(L.vocEnd==null||L.vocEnd<7)return'p8_to5';
  if(!L.bodyClear)return'p8_to6';
  return'p8_closed';
}

/* ---------- ניווט ---------- */
function startFlow(f){
  R.flow=f;R.view='run';R.blsOn=false;
  R.s=f==='p37'?newS():f==='p2'?{sets:0}:f==='p8'?{target:lastS().target,nc:lastS().nc,pc:lastS().pc,image:lastS().image}:{};
  R.step=null;R.hist=[];
  go({p1:'p1_problem',p2:'p2_start',p37:'p3_tgt',p8:'p8_open'}[f]);R.hist=[];
}
function go(to){
  if(to.startsWith('@'))return special(to);
  let st=STEPS[to];while(st.route){to=st.route(R.s);st=STEPS[to]}
  if(R.step)R.hist.push(R.step);
  R.step=to;
  if(st.input&&st.input.type==='list')R.list=JSON.parse(JSON.stringify(getVal(st.input.key)||[]));
  render();window.scrollTo(0,0);
}
function special(to){
  const s=R.s;
  if(to==='@home'){DB.draft=null;R.view='home';render();return}
  if(to==='@plan-p2'){finishPlan(false);startFlow('p2');return}
  if(to==='@plan-done'){finishPlan(true);DB.draft=null;R.view='home';render();return}
  if(to==='@res-save'){D.resources.unshift({kind:s.kind||'מקום בטוח',image:s.image,emotions:s.emotions,cue:s.cue});DB.draft=null;R.view='home';render();return}
  if(to==='@p8-addmem'){(s.newMems||[]).forEach(m=>{D.plan.memories.push(m);D.targets.push({name:m.text,kind:'עבר',status:'חדש'})});go('p8_tgt');return}
  if(to==='@p8-next'){const t=D.targets.find(x=>x.name===lastS().target);if(t)t.status='הושלם';startFlow('p37');return}
  if(to.startsWith('@resume')){const L=lastS(),v=s.sudR??s.sud8??0,first=to.split(':')[1]||'p4_cont';R.flow='p37';R.view='run';
    R.s=Object.assign(newS(),{target:L.target,image:s.image||L.image,nc:L.nc,pc:L.pc,voc0:L.voc0,sud0:L.sud0,emotions:s.emotions||L.emotions,body:s.body||L.body,
      sudLast:v,sudLog:[v],vocLast:first==='p6'?L.vocEnd:null});
    const t=D.targets.find(x=>x.name===L.target);if(t)t.status='בעיבוד';
    R.step=null;R.hist=[];go(first);R.hist=[];return}
  if(to==='@finish'){
    const c=!!s.complete;
    D.sessions.push({date:today(),target:s.target,image:s.image,nc:s.nc,pc:s.pc,voc0:s.voc0,emotions:s.emotions,sud0:s.sud0,body:s.body,
      sudEnd:c?0:s.sudLast,vocEnd:s.vocLast,bodyClear:!!s.bodyClear,complete:c,sets:s.sets,stab:s.stab||'ללא',reflect:s.reflect,notes:s.notes,sudLog:s.sudLog.slice(),log:(s.log||[]).slice()});
    const t=D.targets.find(x=>x.name===s.target);if(t)t.status=c?'הושלם':'בעיבוד';
    R.sumIdx=D.sessions.length-1;DB.draft=null;R.view='summary';render();window.scrollTo(0,0);return}
}
function finishPlan(withTarget){
  const P=D.plan,old=D.targets;const keep=n=>{const o=old.find(t=>t.name===n);return o?o.status:null};
  const ch=withTarget&&R.s.chosen!=null?R.s.chosen:-1;
  const past=P.memories.map((m,i)=>{const name=i===ch&&R.s.tname?R.s.tname:m.text;const ex=old.find(t=>t.src===m.text||t.name===name);
    return{name:ex?ex.name:name,src:m.text,kind:'עבר',touch:m.touch,status:i===ch?'הבא בתור':(ex?ex.status:'ממתין')}});
  const pres=(P.triggers||[]).map(x=>({name:x,kind:'הווה',status:keep(x)||'ממתין'}));
  const fut=(P.future||[]).map(x=>({name:x,kind:'עתיד',status:keep(x)||'ממתין'}));
  const extra=old.filter(t=>t.kind!=='עבר'&&!pres.concat(fut).some(n=>n.name===t.name));
  D.targets=past.concat(pres,fut,extra);
}
function back(){if(!R.hist.length){R.view='home';render();return}R.step=R.hist.pop();const st=STEPS[R.step];if(st.input&&st.input.type==='list')R.list=JSON.parse(JSON.stringify(getVal(st.input.key)||[]));render()}

/* ---------- תצוגה ---------- */
const FLOWNAME={p1:'שלב 1 · תכנון טיפול',p2:'שלב 2 · הכנה וייצוב',p37:'שלבים 3–7 · עיבוד',p8:'שלב 8 · הערכה מחודשת'};
function genderSeg(){return`<span class="seg-label">נוסח התסריטים</span><span class="seg" role="group" aria-label="מגדר המטופל"><button data-a="gender" data-g="m" aria-pressed="${D.client.gender==='m'}">זכר</button><button data-a="gender" data-g="f" aria-pressed="${D.client.gender==='f'}">נקבה</button></span>`}
function brand(){return`<span class="brand"><span class="mark" aria-hidden="true"><i></i><i></i></span>מצפן EMDR</span>`}

function renderHome(){
  const L=lastS(),P=D.plan,touch=P.memories.find(m=>m.touch);
  const next=D.targets.find(t=>t.status==='בעיבוד'||t.status==='הבא בתור')||D.targets.find(t=>t.status!=='הושלם');
  const group=k=>{const items=D.targets.filter(t=>t.kind===k);return`<div><h4>${k}</h4>${items.length?items.map(t=>`<div class="trow"><span class="nm">${esc(t.name)} ${t.touch?'<span class="star">★ Touchstone</span>':''}</span><span class="pill ${stClass(t.status)}">${t.status}</span></div>`).join(''):'<div class="trow"><span class="nm" style="color:var(--muted)">אין עדיין</span></div>'}</div>`};
  return`<header class="bar"><button class="ghost" data-a="clients">→ המטופלים</button><span class="spacer"></span>${genderSeg()}<button class="ghost" data-a="lock">נעילה</button></header>${msgHtml()}${draftHtml(D.id)}
  <section class="client"><div><h1>${esc(D.client.name)}</h1><div class="meta">${D.demo?'<span class="tag">דוגמה</span> ':''}${esc(P.problem||'הנושא הטיפולי ייקבע בשלב 1')}</div></div>
   <div class="meta">BLS: <b>${esc(D.client.bls.type)}</b>${D.client.bls.dir?', '+esc(D.client.bls.dir):''} · סימן עצירה: <b>${esc(D.client.stop)}</b></div></section>
  <div class="modules">
   <div class="mod"><span class="pn">1</span><h3>תכנון טיפול</h3><p>${P.memories.length} זיכרונות עבר · ${(P.triggers||[]).length} טריגרים · ${(P.future||[]).length} תבניות עתיד${touch?`<br>Touchstone: ${esc(touch.text)}`:''}</p><button class="primary" data-a="start" data-f="p1">${P.memories.length?'עדכון התוכנית':'בניית התוכנית'}</button></div>
   <div class="mod"><span class="pn">2</span><h3>הכנה וייצוב</h3><p>בבנק המשאבים: ${D.resources.length} · משאבים נדרשים: ${(P.resNeed||[]).map(esc).join(', ')||'אין'}</p><button class="primary" data-a="start" data-f="p2">מקום בטוח / הכנה</button></div>
   <div class="mod"><span class="pn">3–7</span><h3>פגישת עיבוד</h3><p>${next?`טרגט הבא: ${esc(next.name)} (${next.status})`:'כל הטרגטים הושלמו'}</p><button class="primary" data-a="start" data-f="p37" ${next?'':'disabled'}>התחלת עיבוד</button></div>
   <div class="mod"><span class="pn">8</span><h3>הערכה מחודשת</h3><p>${L?`פגישה אחרונה ${L.date} · ${esc(L.target)} · ${L.complete?'הושלם':'לא הושלם'} · SUD בסוף ${L.sudEnd??'—'}`:'אין פגישה קודמת'}</p><button class="primary" data-a="start" data-f="p8" ${L?'':'disabled'}>פתיחת פגישה</button></div>
  </div>
  <div class="cols">
   <section><h2 class="sec-h">טרגטים · עבר, הווה, עתיד</h2><div class="box triad">${group('עבר')}${group('הווה')}${group('עתיד')}</div></section>
   <section><h2 class="sec-h">בנק משאבים</h2><div class="box">${D.resources.length?D.resources.map(r=>`<div class="res"><span class="k">${esc(r.kind)}</span><span>${esc(r.image)}</span><span class="cue">"${esc(r.cue)}"</span><span style="color:var(--muted);font-size:.88rem">${esc(r.emotions)}</span></div>`).join(''):'<p style="color:var(--muted);margin:0">עדיין לא הותקן משאב. אפשר להתקין מקום בטוח בשלב 2.</p>'}</div></section>
  </div>
  <section style="margin-bottom:24px"><h2 class="sec-h">דף סיכום פגישות עיבוד</h2>
   <div class="tablewrap"><table><thead><tr><th>תאריך</th><th>טרגט / תמונה</th><th>אמונה שלילית / חיובית</th><th>VOC</th><th>רגשות</th><th>SUD</th><th>מיקום בגוף</th><th>SUD סוף</th><th>VOC סוף</th><th></th></tr></thead><tbody>
   ${D.sessions.map((x,i)=>`<tr><td class="n">${x.date}</td><td>${esc(x.target)}<br><span style="color:var(--muted)">${esc(x.image)}</span></td><td>${esc(G(x.nc))}<br><span style="color:var(--muted)">${esc(G(x.pc))}</span></td><td class="n">${x.voc0??'—'}</td><td>${esc(x.emotions)}</td><td class="n">${x.sud0??'—'}</td><td>${esc(x.body)}</td><td class="n">${x.sudEnd??'—'}</td><td class="n">${x.vocEnd??'—'}</td><td><button class="link" data-a="sum" data-i="${i}">סיכום</button></td></tr>`).join('')}
   </tbody></table></div></section>
  ${homeFooter()}`;
}

function phaseBar(){
  const st=STEPS[R.step];
  if(R.flow!=='p37')return`<span class="ph on">${FLOWNAME[R.flow]}</span>`;
  const P=[['3','הערכה'],['4','דה-סנסיטיזציה'],['5','התקנה'],['6','סריקת גוף'],['7','סגירה']];
  const cur=+st.phase;return P.map(([n,l])=>`<span class="ph ${+n===cur?'on':+n<cur?'done':''}">${n} ${l}</span>`).join('');
}
function renderInput(st){
  const I=st.input,s=R.s;if(!I)return'';
  if(I.type==='go')return`<div class="opts"><button class="opt rec" data-a="gonext">${esc(I.label)}<span class="badge">המשך</span></button></div>`;
  if(I.type==='choice'){const opts=typeof I.opts==='function'?I.opts(s):I.opts;const r=I.rec?I.rec(s):null;
    if(!opts.length)return'<p class="note">אין אפשרויות זמינות.</p>';
    const said=I.said?`<label for="said" class="sec-h" style="display:block">מה המטופל/ת אומר/ת (כמה מילים)</label><input class="field" id="said" autocomplete="off" placeholder="נרשם ביומן הסטים עם הלחיצה על התגובה" style="margin-bottom:12px">`:'';
    return`${said}<div class="opts">${opts.map((o,i)=>`<button class="opt ${i===r?'rec':''}" data-a="opt" data-i="${i}"><span>${esc(G(o.label))}</span>${i===r?'<span class="badge">מומלץ</span>':''}</button>`).join('')}</div>`}
  if(I.type==='text'){const v=getVal(I.key)??(I.def?I.def(s):'');
    const f=I.multi?`<textarea class="field" id="inp" placeholder="${esc(I.ph||'תשובת המטופל/ת')}">${esc(G(v))}</textarea>`:`<input class="field" id="inp" value="${esc(G(v))}" placeholder="${esc(I.ph||'תשובת המטופל/ת')}" autocomplete="off">`;
    return`<label for="inp" class="sec-h" style="display:block">תשובה</label>${f}<div class="row"><button class="primary" data-a="textnext">המשך</button></div>`}
  if(I.type==='fields')return`<div style="display:grid;gap:12px">${I.fields.map((f,i)=>`<div><label for="fd${i}" class="sec-h" style="display:block;margin-bottom:4px">${esc(f.label)}</label><input class="field" id="fd${i}" value="${esc(getVal(f.key)||'')}" autocomplete="off"></div>`).join('')}</div><div class="row"><button class="primary" data-a="fieldsnext">המשך</button></div>`;
  if(I.type==='scale'){let b='';for(let v=I.min;v<=I.max;v++)b+=`<button data-a="scale" data-v="${v}" aria-label="${v}">${v}</button>`;
    return`<div class="scale">${b}</div><div class="scale-ends"><span>${esc(I.lo)}</span><span>${esc(I.hi)}</span></div>`}
  if(I.type==='nc'){return NCS.map((c,ci)=>`<div class="nccat"><h4>${c.cat}</h4><div class="chips">${c.items.map((p,pi)=>`<button class="chip" data-a="nc" data-c="${ci}" data-i="${pi}" aria-pressed="${s.nc===p[0]}">${esc(G(p[0]))}</button>`).join('')}</div></div>`).join('')
    +`<label for="inp" class="sec-h" style="display:block;margin-top:14px">או במילים של המטופל/ת</label><input class="field" id="inp" value="${esc(s.nc&&!NCS.some(c=>c.items.some(p=>p[0]===s.nc))?s.nc:'')}" autocomplete="off">`
    +(s.pcSug?`<p class="pcs">PC מקביל מהטבלה: ${esc(G(s.pcSug))}</p>`:'')+`<div class="row"><button class="primary" data-a="ncnext">המשך</button></div>`}
  if(I.type==='list'){
    const items=R.list.map((m,i)=>{const t=typeof m==='string'?m:m.text;return`<div class="litem"><span class="tx">${esc(t)}</span>${I.age&&m.age?`<span class="age">גיל ${esc(m.age)}</span>`:''}${I.flags?`<button class="tog" data-a="ltog" data-i="${i}" data-f="touch" aria-pressed="${!!m.touch}">Touchstone</button><button class="tog" data-a="ltog" data-i="${i}" data-f="worst" aria-pressed="${!!m.worst}">הכי קשה</button>`:''}<button class="x" data-a="ldel" data-i="${i}" aria-label="מחיקה">✕</button></div>`}).join('');
    return`<div>${items||'<p class="note">עדיין לא נרשם דבר.</p>'}</div><div class="ladd ${I.age?'':'noage'}"><input class="field" id="lt" placeholder="${esc(I.ph||'')}" autocomplete="off" aria-label="פריט חדש">${I.age?'<input class="field" id="la" placeholder="גיל" autocomplete="off" aria-label="גיל">':''}<button class="ghost" data-a="ladd">הוספה</button></div><div class="row"><button class="primary" data-a="lnext">המשך</button></div>`}
  return'';
}
function ctxRail(){
  const s=R.s;
  if(R.flow==='p37'||R.flow==='p8'){
    const L=lastS();
    const spark=(s.sudLog||[]).length?`<div class="spark" aria-label="מהלך SUD">${s.sudLog.map(v=>`<i style="height:${Math.max(4,v*10)}%" title="${v}"></i>`).join('')}</div>`:'';
    let h=`<div class="box"><div class="kv"><div class="k">טרגט</div><div class="v">${esc(s.target||'טרם נבחר')}</div></div>
     ${s.image?`<div class="kv"><div class="k">תמונה</div><div class="v">${esc(s.image)}</div></div>`:''}
     ${s.nc?`<div class="kv"><div class="k">NC</div><div class="v script-sm">${esc(G(s.nc))}</div></div>`:''}
     ${s.pc?`<div class="kv"><div class="k">PC</div><div class="v script-sm">${esc(G(s.pc))}</div></div>`:''}</div>`;
    if(R.flow==='p37')h+=`<div class="box"><div class="meters"><div class="meter"><div class="k">SUD</div><div class="v">${s.sudLast??'—'}${s.sud0!=null?` <small>מתוך ${s.sud0} בהתחלה</small>`:''}</div>${spark}</div>
      <div class="meter"><div class="k">VOC</div><div class="v">${s.vocLast??s.voc0??'—'}${s.vocLast!=null&&s.voc0!=null?` <small>היה ${s.voc0}</small>`:''}</div></div></div>
      <div class="counters num">סטים: ${s.sets||0} · ללא שינוי ברצף: ${s.noch||0} · ניטרלי ברצף: ${s.neu||0}</div></div>`;
    if(R.flow==='p37'&&(s.log||[]).length)h+=`<div class="box"><div class="kv"><div class="k">יומן סטים · אחרונים</div>${s.log.slice(-4).reverse().map(l=>`<div class="v"><span class="num" style="color:var(--muted)">סט ${l.set} · </span>${esc(l.text)}</div>`).join('')}</div></div>`;
    if(R.flow==='p8'&&L)h+=`<div class="box"><div class="kv"><div class="k">מאיפה הפסקנו · ${L.date}</div><div class="v">${L.complete?'עיבוד הושלם':'עיבוד לא הושלם'} · SUD ${L.sud0}→${L.sudEnd??'—'} · VOC ${L.voc0}→${L.vocEnd??'—'} · ${L.sets} סטים</div></div>${L.notes?`<div class="kv"><div class="k">לחזור אל</div><div class="v">${esc(L.notes)}</div></div>`:''}${L.reflect?`<div class="kv"><div class="k">משפט הסיום</div><div class="v script-sm">${esc(L.reflect)}</div></div>`:''}</div>`;
    h+=`<div class="box"><div class="kv"><div class="k">BLS · סימן עצירה</div><div class="v">${esc(D.client.bls.type)}, ${esc(D.client.bls.dir)} · ${esc(D.client.stop)}</div></div></div>`;
    return h}
  if(R.flow==='p2')return`<div class="box"><div class="kv"><div class="k">סוג</div><div class="v">${esc(s.kind||'—')}</div></div>${s.image?`<div class="kv"><div class="k">תמונה</div><div class="v">${esc(s.image)}</div></div>`:''}${s.emotions?`<div class="kv"><div class="k">רגשות ותחושות</div><div class="v">${esc(s.emotions)}</div></div>`:''}${s.cue?`<div class="kv"><div class="k">סימן מילולי</div><div class="v script-sm">"${esc(s.cue)}"</div></div>`:''}<div class="counters num">סטים: ${s.sets||0} (איטיים וקצרים)</div></div>`;
  const P=D.plan;return`<div class="box"><div class="kv"><div class="k">בעיה</div><div class="v">${esc(P.problem||'—')}</div></div><div class="kv"><div class="k">דוגמה מייצגת</div><div class="v">${esc(P.rep||'—')}</div></div><div class="counters num">${P.memories.length} זיכרונות · ${(P.triggers||[]).length} טריגרים · ${(P.future||[]).length} תבניות עתיד</div></div>`;
}
function renderRun(){
  const st=STEPS[R.step],s=R.s;
  const script=st.scriptFn?st.scriptFn(s):st.script;
  const adv=st.advice?st.advice(s):null;
  const bls=st.bls?`<div class="bls ${st.bls}"><div class="track"><span class="dot ${R.blsOn?'on':''}"></span></div><div class="blsmeta"><span>סט <b class="num">${(s.sets||0)+1}</b></span><span>${st.bls==='slow'?'4–8 passes איטיים':'20–30 passes, מהיר ותדיר'}</span><span>${esc(D.client.bls.type)}</span><span class="spacer"></span><button class="ghost" data-a="bls">${R.blsOn?'עצירת מחוון הקצב':'הפעלת מחוון הקצב'}</button></div></div>`:'';
  return`<header class="bar"><button class="ghost" data-a="back">→ חזרה</button><button class="ghost" data-a="home">התיק של ${esc(D.client.name)}</button><span class="phases">${phaseBar()}</span><span class="spacer"></span>${genderSeg()}${R.flow==='p37'&&+st.phase<7?'<button class="timeout" data-a="timeout">הזמן נגמר</button>':''}<button class="stopbtn" data-a="stop">עצירה</button></header>
  <main class="run"><section class="stage"><div style="display:flex;gap:10px;align-items:flex-start"><div class="eyebrow" style="flex:1">${FLOWNAME[R.flow]} · שלב ${st.phase}</div><button class="ghost" data-a="skip" style="padding:4px 12px;font-size:.88rem">דלג למסך הבא ←</button></div><h2>${esc(st.title)}</h2>
   ${script?`<p class="script">${fill(script)}</p>`:''}
   ${st.note?`<p class="note">${esc(G(st.note))}</p>`:''}
   ${adv?`<div class="advice ${adv[0]==='warn'?'warn':''}"><b>המלצת הפרוטוקול</b>${esc(adv[1])}</div>`:''}
   ${bls}${renderInput(st)}</section>
   <aside class="ctx">${ctxRail()}</aside></main>`;
}
function renderSummary(){
  const x=D.sessions[R.sumIdx];const log=x.sudLog||[];
  return`<header class="bar">${brand()}<span class="spacer"></span><button class="ghost" data-a="home">חזרה לתיק</button></header>
  <div class="sumhead"><h1>סיכום מפגש טיפולי</h1><span class="pill ${x.complete?'st-done':'st-prog'}">${x.complete?'עיבוד שהושלם':'עיבוד שלא הושלם'}</span><span class="num" style="color:var(--muted)">${x.date}</span></div>
  <div class="grid2">
   <div class="box kv"><div class="k">זיכרון טרגט</div><div class="v">${esc(x.target)}</div><div class="k" style="margin-top:8px">תמונה</div><div class="v">${esc(x.image)}</div></div>
   <div class="box kv"><div class="k">NC</div><div class="v script-sm">${esc(G(x.nc))}</div><div class="k" style="margin-top:8px">PC</div><div class="v script-sm">${esc(G(x.pc))}</div></div>
   <div class="box kv"><div class="k">מדדים</div><div class="v num">SUD ${x.sud0??'—'} ← ${x.sudEnd??'—'}<br>VOC ${x.voc0??'—'} ← ${x.vocEnd??'—'}<br>${x.sets} סטים</div></div>
   <div class="box kv"><div class="k">רגשות · גוף</div><div class="v">${esc(x.emotions)} · ${esc(x.body)}</div><div class="k" style="margin-top:8px">ייצוב בסוף</div><div class="v">${esc(x.stab)}</div></div>
  </div>
  ${log.length?`<div class="box" style="margin-bottom:16px"><h2 class="sec-h">מהלך SUD בפגישה</h2><div class="bars">${log.map(v=>`<div class="b"><span>${v}</span><i style="height:${Math.max(3,v*10)}%"></i></div>`).join('')}</div><div class="bars-cap">כל עמודה היא בדיקת SUD, לפי סדר הפגישה (סקאלה 0–10).</div></div>`:''}
  ${(x.log||[]).length?`<div class="box kv" style="margin-bottom:16px"><div class="k">יומן סטים: מה המטופל/ת אמר/ה</div>${x.log.map(l=>`<div class="v"><span class="num" style="color:var(--muted)">סט ${l.set} · </span>${esc(l.text)}</div>`).join('')}</div>`:''}
  <div class="grid2"><div class="box kv"><div class="k">משפט סיום של המטופל/ת</div><div class="v script-sm">${esc(x.reflect||'—')}</div></div>
   <div class="box kv"><div class="k">נושאים לחזור ולהעריך בהמשך</div><div class="v">${esc(x.notes||'—')}</div></div></div>
  <div class="row"><button class="primary" data-a="home">חזרה לתיק</button>${R.sumIdx===D.sessions.length-1?'<button class="ghost" data-a="start" data-f="p8">הדגמה: פתיחת הפגישה הבאה (שלב 8)</button>':''}</div>`;
}
function renderOv(){
  const ov=document.getElementById('ov');ov.hidden=!R.ov;if(!R.ov){ov.innerHTML='';return}
  const r=res();
  ov.innerHTML=`<div class="ov"><div class="ovcard" role="dialog" aria-modal="true" aria-labelledby="ovh"><h2 id="ovh">עצירה</h2>
   <p class="script">${fill('[בוא|בואי] נעצור לרגע. [שחרר|שחררי], [קח|קחי] נשימה.')}</p>
   ${r?`<p class="script">${fill('[העלה|העלי] את {RES}. [אמור|אמרי] לעצמך {CUE}, [ושים|ושימי] לב למה [שאתה חווה|שאת חווה] עכשיו.')}</p><p class="note">${esc(r.kind)} מבנק המשאבים: ${esc(r.emotions)}</p>`:'<p class="note">אין משאב בבנק. אפשר נשימות או קרקוע: "[שים|שימי] לב לכפות הרגליים על הרצפה, ולחמישה דברים [שאתה רואה|שאת רואה] בחדר."</p>'}
   <p class="script">${fill('[שים|שימי] לב לכפות הרגליים על הרצפה, ולחמישה דברים [שאתה רואה|שאת רואה] בחדר עכשיו.')}</p>
   <div class="row"><button class="primary" data-a="ovclose">חזרה לפרוטוקול</button>${R.flow==='p37'&&R.view==='run'?'<button class="timeout" data-a="ovclose-inc">סגירת עיבוד שלא הושלם</button>':''}</div></div></div>`;
  const b=ov.querySelector('[data-a="ovclose"]');b&&b.focus();
}
function render(){
  const app=document.getElementById('app');
  app.innerHTML=viewHtml();
  if(R.view==='run'&&DB&&D&&R.step)DB.draft={clientId:D.id,flow:R.flow,step:R.step,s:R.s,hist:R.hist,list:R.list,at:Date.now()};
  renderOv();
  const f=app.querySelector('#inp');if(f&&R.view==='run'){try{f.focus({preventScroll:true})}catch(e){}}
  const p=app.querySelector('#pw,#pw1');if(p&&!R.busy)p.focus();
}

/* ---------- אירועים ---------- */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-a]');if(!b)return;
  const a=b.dataset.a;
  if(ASYNC.includes(a)){handleAsync(a,b);return}
  if(handleApp(a,b)){if(VK&&DB)save();return}
  const st=R.step&&STEPS[R.step],I=st&&st.input,s=R.s;
  switch(a){
    case'start':startFlow(b.dataset.f);break;
    case'home':R.view='home';render();break;
    case'back':back();break;
    case'gender':D.client.gender=b.dataset.g;render();break;
    case'stop':R.ov=true;renderOv();break;
    case'ovclose':R.ov=false;renderOv();break;
    case'ovclose-inc':R.ov=false;s.forceInc=true;go('p7');break;
    case'timeout':s.forceInc=true;go('p7');break;
    case'bls':R.blsOn=!R.blsOn;render();break;
    case'sum':R.sumIdx=+b.dataset.i;R.view='summary';render();window.scrollTo(0,0);break;
    case'gonext':I.act&&I.act(s);go(I.to);break;
    case'opt':{const opts=typeof I.opts==='function'?I.opts(s):I.opts;const o=opts[+b.dataset.i];
      const sd=document.getElementById('said');if(sd&&sd.value.trim()){s.log=s.log||[];s.log.push({set:s.sets||0,text:sd.value.trim()})}
      o.act&&o.act(s);go(o.to);break}
    case'fieldsnext':I.fields.forEach((f,i)=>setVal(f.key,document.getElementById('fd'+i).value.trim()));go(I.to);break;
    case'skip':{
      if(st.skip){go(typeof st.skip==='function'?st.skip(s):st.skip);break}
      if(I.type==='choice'){const opts=typeof I.opts==='function'?I.opts(s):I.opts;if(!opts.length){R.view='home';render();break}const r=I.rec?I.rec(s):null;const o=opts[r??0];o.act&&o.act(s);go(o.to);break}
      if(I.type==='text'){const el=document.getElementById('inp');if(el&&el.value.trim())setVal(I.key,el.value.trim())}
      if(I.type==='list')setVal(I.key,R.list.slice());
      if(I.type==='fields')I.fields.forEach((f,i)=>{const el=document.getElementById('fd'+i);if(el&&el.value.trim())setVal(f.key,el.value.trim())});
      if(I.type==='scale'){go(I.to(undefined,s));break}
      go(I.to);break}
    case'textnext':{const v=document.getElementById('inp').value.trim();setVal(I.key,v);go(I.to);break}
    case'scale':{const v=+b.dataset.v;I.before&&I.before(s);setVal(I.key,v);I.after&&I.after(s,v);go(I.to(v,s));break}
    case'nc':{const p=NCS[+b.dataset.c].items[+b.dataset.i];s.nc=p[0];s.pcSug=p[1];s.pc=null;render();break}
    case'ncnext':{const free=document.getElementById('inp').value.trim();if(free){s.nc=free;s.pcSug=null;s.pc=null}if(!s.nc)return;go(I.to);break}
    case'ladd':{const t=document.getElementById('lt').value.trim();if(!t)return;const ag=document.getElementById('la');
      R.list.push(I.age||I.flags?{text:t,age:ag?ag.value.trim():'',touch:false,worst:false}:t);render();const n=document.getElementById('lt');n&&n.focus();break}
    case'ldel':R.list.splice(+b.dataset.i,1);render();break;
    case'ltog':{const i=+b.dataset.i,f=b.dataset.f;const on=!R.list[i][f];if(on)R.list.forEach(m=>{m[f]=false});R.list[i][f]=on;render();break}
    case'lnext':setVal(I.key,R.list.slice());go(I.to);break;
  }
  if(VK&&DB)save();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&R.ov){R.ov=false;renderOv();return}
  if(e.key==='Enter'&&e.target.id==='lt'){e.preventDefault();document.querySelector('[data-a="ladd"]').click();return}
  if(e.key==='Enter'&&e.target.id==='la'){e.preventDefault();document.querySelector('[data-a="ladd"]').click();return}
  if(e.key==='Enter'&&e.target.id==='pw'){e.preventDefault();doUnlock();return}
  if(e.key==='Enter'&&e.target.id==='pw2'){e.preventDefault();doSetup();return}
  if(e.key==='Enter'&&e.target.tagName==='INPUT'&&e.target.id==='inp'){e.preventDefault();const n=document.querySelector('[data-a="textnext"],[data-a="ncnext"]');n&&n.click()}
});

/* ===================== אחסון מוצפן (AES-GCM 256, מפתח מסיסמה ב-PBKDF2) ===================== */
const DBNAME='mazpen-emdr',STORE='vault',VKEY='main',ITER=600000;
let VK=null,SALT=null,saveTimer=null,idleTimer=null,hiddenAt=null,pendingRestore=null;
const TE=new TextEncoder(),TD=new TextDecoder();
function uid(){return Array.from(crypto.getRandomValues(new Uint8Array(8)),b=>b.toString(16).padStart(2,'0')).join('')}
function b64(buf){const u=new Uint8Array(buf);let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)}
function unb64(s){const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
async function deriveKey(pw,salt,iter){
  const base=await crypto.subtle.importKey('raw',TE.encode(pw),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:iter||ITER,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
async function seal(obj){
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},VK,TE.encode(JSON.stringify(obj)));
  return{app:'mazpen-emdr',v:1,kdf:'PBKDF2-SHA256',iter:ITER,salt:b64(SALT),iv:b64(iv),ct:b64(ct),saved:new Date().toISOString()};
}
async function unseal(env,key){const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(env.iv)},key,unb64(env.ct));return JSON.parse(TD.decode(pt))}
function idb(){return new Promise((res,rej)=>{const r=indexedDB.open(DBNAME,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function idbGet(){const db=await idb();return new Promise((res,rej)=>{const q=db.transaction(STORE).objectStore(STORE).get(VKEY);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}
async function idbPut(v){const db=await idb();return new Promise((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(v,VKEY);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)})}
async function idbDel(){const db=await idb();return new Promise((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(VKEY);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)})}

async function persistNow(){
  clearTimeout(saveTimer);saveTimer=null;if(!VK||!DB)return;
  try{await idbPut(await seal(DB));if(R.saveErr){R.saveErr=null;render()}}
  catch(e){R.saveErr='השמירה בטאבלט נכשלה ('+e.message+'). מומלץ לגבות עכשיו.';render()}
}
function save(){if(!VK)return;clearTimeout(saveTimer);saveTimer=setTimeout(persistNow,250)}
async function lockNow(){
  if(!VK)return;await persistNow();
  VK=null;DB=null;D=null;R.view='lock';R.ov=false;R.flow=null;R.step=null;R.s={};R.msg=null;R.info=null;R.forgot=false;
  clearTimeout(idleTimer);render();
}
function bumpIdle(){if(!VK||!DB)return;clearTimeout(idleTimer);idleTimer=setTimeout(lockNow,(DB.settings.lockMin||10)*60000)}
['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,bumpIdle,{passive:true}));
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){hiddenAt=Date.now();persistNow()}
  else if(hiddenAt&&VK&&Date.now()-hiddenAt>2*60000)lockNow();
});
window.addEventListener('pagehide',()=>{persistNow()});

const val=id=>{const e=document.getElementById(id);return e?e.value:''};
function msg(t){R.busy=null;R.msg=t;R.info=null;render()}
function busy(t){R.busy=t;R.msg=null;render()}
function newDB(){return{v:1,created:Date.now(),clients:[],draft:null,lastBackup:null,settings:{lockMin:10}}}

async function doSetup(){
  const p1=val('pw1'),p2=val('pw2'),ok=document.getElementById('ack').checked;
  if(p1.length<8)return msg('הסיסמה צריכה להכיל לפחות 8 תווים.');
  if(p1!==p2)return msg('שתי הסיסמאות לא זהות.');
  if(!ok)return msg('יש לאשר שהבנת שסיסמה שנשכחה לא ניתנת לשחזור.');
  busy('מצפין…');
  SALT=crypto.getRandomValues(new Uint8Array(16));VK=await deriveKey(p1,SALT);DB=newDB();
  await persistNow();afterUnlock();
}
async function doUnlock(){
  const pw=val('pw');if(!pw)return;busy('פותח…');
  try{const env=await idbGet();const salt=unb64(env.salt);const key=await deriveKey(pw,salt,env.iter);DB=await unseal(env,key);VK=key;SALT=salt;afterUnlock()}
  catch(e){msg('הסיסמה שגויה.')}
}
function afterUnlock(){
  R.busy=null;R.msg=null;R.info=null;R.view='clients';D=null;
  DB.settings=DB.settings||{lockMin:10};bumpIdle();
  try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
  render();
}
function stamp(d){const p=n=>String(n).padStart(2,'0');return`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`}
async function exportBackup(){
  DB.lastBackup=Date.now();await persistNow();
  const env=await seal(DB);const name=`mazpen-backup-${stamp(new Date())}.json`;
  const blob=new Blob([JSON.stringify(env)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000);
  DB.lastBackup=Date.now();await persistNow();
  R.msg=null;R.info=`קובץ הגיבוי ${name} נשמר. אם Chrome מוגדר לשמור הורדות בכרטיס ה-SD, הוא כבר שם; אחרת העבר/י אותו לכרטיס דרך אפליקציית הקבצים.`;render();
}
async function readBackup(){
  const inp=document.getElementById('bf');const f=inp&&inp.files[0];const pw=val('bpw');
  if(!f||!pw)return msg('יש לבחור קובץ גיבוי ולהזין את הסיסמה שאיתה נוצר.');
  let env;try{env=JSON.parse(await f.text())}catch(e){return msg('הקובץ אינו קובץ גיבוי תקין.')}
  if(env.app!=='mazpen-emdr')return msg('הקובץ אינו גיבוי של מצפן EMDR.');
  busy('מפענח…');
  try{const salt=unb64(env.salt);const key=await deriveKey(pw,salt,env.iter);const data=await unseal(env,key);
    pendingRestore={data,key,salt,saved:env.saved};R.busy=null;R.msg=null;render()}
  catch(e){msg('הסיסמה לא מתאימה לקובץ הגיבוי.')}
}
async function applyRestore(){const p=pendingRestore;DB=p.data;VK=p.key;SALT=p.salt;pendingRestore=null;D=null;await persistNow();afterUnlock();R.info='הגיבוי שוחזר. מעכשיו הסיסמה היא הסיסמה של קובץ הגיבוי.';render()}
async function changePw(){
  const cur=val('cp0'),n1=val('cp1'),n2=val('cp2');
  if(n1.length<8)return msg('הסיסמה החדשה צריכה להכיל לפחות 8 תווים.');
  if(n1!==n2)return msg('הסיסמאות החדשות לא זהות.');
  busy('מעדכן…');
  try{const env=await idbGet();const k=await deriveKey(cur,unb64(env.salt),env.iter);await unseal(env,k)}catch(e){return msg('הסיסמה הנוכחית שגויה.')}
  SALT=crypto.getRandomValues(new Uint8Array(16));VK=await deriveKey(n1,SALT);await persistNow();
  R.busy=null;R.msg=null;R.info='הסיסמה עודכנה. גיבויים קודמים נשארים עם הסיסמה הקודמת, ולכן מומלץ לגבות עכשיו.';render();
}
async function wipeAll(){VK=null;DB=null;D=null;clearTimeout(saveTimer);clearTimeout(idleTimer);await idbDel();Object.assign(R,{view:'setup',wipeArm:false,forgot:false,msg:null,info:null});render()}

/* ===================== מטופלים ===================== */
function blankClient(f){return{id:uid(),created:Date.now(),demo:false,
  client:{name:f.name.trim(),gender:f.gender,bls:{type:f.bls,dir:f.dir,dist:''},stop:f.stop},
  plan:{problem:f.problem,examples:'',rep:'',memories:[],triggers:[],future:[],resHave:'',resNeed:[]},
  resources:[],targets:[],sessions:[]}}
function syncForm(){const f=R.form;['name','dir','stop','problem'].forEach(k=>{const e=document.getElementById('cf-'+k);if(e)f[k]=e.value})}
function saveClientForm(){
  syncForm();const f=R.form;if(!f.name.trim())return msg('יש להזין שם או כינוי.');
  if(f.id){const c=DB.clients.find(x=>x.id===f.id);Object.assign(c.client,{name:f.name.trim(),gender:f.gender,stop:f.stop});c.client.bls.type=f.bls;c.client.bls.dir=f.dir;c.plan.problem=f.problem;D=c}
  else{D=blankClient(f);DB.clients.push(D)}
  R.msg=null;R.view='home';render();
}
function resumeDraft(){
  const d=DB.draft;const c=d&&DB.clients.find(x=>x.id===d.clientId);if(!c){DB.draft=null;render();return}
  D=c;R.flow=d.flow;R.step=d.step;R.s=d.s||{};R.hist=d.hist||[];R.list=d.list||[];R.view='run';R.blsOn=false;render();
}
function draftHtml(onlyFor){
  const d=DB.draft;if(!d||!STEPS[d.step])return'';const c=DB.clients.find(x=>x.id===d.clientId);if(!c)return'';
  if(onlyFor&&onlyFor!==c.id)return'';
  const when=new Date(d.at).toLocaleString('he-IL',{day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit'});
  return`<div class="advice"><b>פגישה פתוחה</b>${esc(c.client.name)} · ${FLOWNAME[d.flow]} · ${esc(STEPS[d.step].title)} · ${when}
   <div class="row"><button class="primary" data-a="resume-draft">המשך מאותה נקודה</button><button class="ghost" data-a="drop-draft">סגירה בלי להמשיך</button></div></div>`;
}
const msgHtml=()=>(R.saveErr?`<div class="advice warn"><b>שמירה</b>${esc(R.saveErr)}</div>`:'')+(R.msg?`<div class="advice warn" role="alert">${esc(R.msg)}</div>`:'')+(R.info?`<div class="advice" role="status">${esc(R.info)}</div>`:'');
const daysSince=t=>t?Math.floor((Date.now()-t)/864e5):null;

/* ===================== מסכים ===================== */
function renderInsecure(){return`<div class="gate"><div class="gatecard">${brand()}<h1>צריך כתובת מאובטחת</h1><p>ההצפנה עובדת רק כשהאפליקציה נפתחת מכתובת https (למשל GitHub Pages), ולא מקובץ מקומי.</p></div></div>`}
function renderSetup(){return`<div class="gate"><div class="gatecard">${brand()}<h1>הגדרה ראשונה</h1>
  <p>כל התיקים יישמרו רק בטאבלט הזה, מוצפנים בסיסמה שתבחר/י עכשיו. הסיסמה לא נשמרת בשום מקום, ושום מידע לא נשלח לאינטרנט.</p>
  <label class="lbl" for="pw1">סיסמה (8 תווים לפחות)</label><input class="field" type="password" id="pw1" autocomplete="new-password">
  <label class="lbl" for="pw2">אימות סיסמה</label><input class="field" type="password" id="pw2" autocomplete="new-password">
  <label class="ack"><input type="checkbox" id="ack"> הבנתי: אם אשכח את הסיסמה, אין שום דרך לשחזר את הנתונים.</label>
  ${msgHtml()}
  <button class="primary" data-a="setup" ${R.busy?'disabled':''}>${R.busy||'יצירת כספת מוצפנת'}</button>
  <button class="link" data-a="to-restore">יש לי קובץ גיבוי: שחזור</button></div></div>`}
function renderLock(){return`<div class="gate"><div class="gatecard">${brand()}<h1>התיקים נעולים</h1>
  <label class="lbl" for="pw">סיסמה</label><input class="field" type="password" id="pw" autocomplete="current-password">
  ${msgHtml()}
  <button class="primary" data-a="unlock" ${R.busy?'disabled':''}>${R.busy||'פתיחה'}</button>
  <button class="link" data-a="forgot">שכחתי את הסיסמה</button>
  ${R.forgot?`<div class="box" style="display:grid;gap:10px"><p style="margin:0">אין דרך לפתוח את הנתונים בלי הסיסמה: זה מה שמגן עליהם. אפשר לשחזר מקובץ גיבוי (עם הסיסמה של הגיבוי), או למחוק הכול ולהתחיל מחדש.</p>
   <button class="ghost" data-a="to-restore">שחזור מקובץ גיבוי</button>
   ${R.wipeArm?`<button class="danger" data-a="wipe">כן, למחוק את כל הנתונים בטאבלט</button><button class="ghost" data-a="wipe-arm">ביטול</button>`:`<button class="ghost" data-a="wipe-arm">מחיקת כל הנתונים והתחלה מחדש</button>`}</div>`:''}
  </div></div>`}
function renderRestore(){
  const p=pendingRestore;
  if(p){const n=(p.data.clients||[]).length;const when=p.saved?new Date(p.saved).toLocaleString('he-IL'):'לא ידוע';
    return`<div class="gate"><div class="gatecard">${brand()}<h1>שחזור מגיבוי</h1>
    <div class="box"><div class="kv"><div class="k">בקובץ</div><div class="v">${n} תיקים · נשמר ${esc(when)}</div></div></div>
    ${DB?`<div class="advice warn"><b>שימו לב</b>הנתונים שבטאבלט כרגע (${DB.clients.length} תיקים) יוחלפו בנתוני הגיבוי, והסיסמה תהיה הסיסמה של הגיבוי.</div>`:''}
    <button class="primary" data-a="apply-restore">שחזור</button><button class="ghost" data-a="cancel-restore">ביטול</button></div></div>`}
  return`<div class="gate"><div class="gatecard">${brand()}<h1>שחזור מגיבוי</h1>
   <label class="lbl" for="bf">קובץ גיבוי (mazpen-backup-….json)</label><input class="field" type="file" id="bf" accept=".json,application/json">
   <label class="lbl" for="bpw">הסיסמה שאיתה נוצר הגיבוי</label><input class="field" type="password" id="bpw" autocomplete="off">
   ${msgHtml()}
   <button class="primary" data-a="read-backup" ${R.busy?'disabled':''}>${R.busy||'פענוח הגיבוי'}</button><button class="ghost" data-a="cancel-restore">ביטול</button></div></div>`}
function renderClients(){
  const days=daysSince(DB.lastBackup);
  const bk=DB.clients.some(c=>!c.demo)&&(days===null||days>=7)?`<div class="advice warn"><b>גיבוי</b>${days===null?'עדיין לא נעשה גיבוי.':`הגיבוי האחרון נעשה לפני ${days} ימים.`}<div class="row"><button class="primary" data-a="backup">גיבוי עכשיו</button></div></div>`:'';
  const cards=DB.clients.map(c=>{const L=c.sessions[c.sessions.length-1];const open=c.targets.filter(t=>t.status!=='הושלם').length;
    return`<button class="ccard" data-a="open" data-id="${c.id}"><span class="cn">${esc(c.client.name)} ${c.demo?'<span class="tag">דוגמה</span>':''}</span>
     <span class="cm">${esc(c.plan.problem||'עדיין אין תוכנית טיפול')}</span>
     <span class="cm num">${c.sessions.length} פגישות עיבוד${L?` · אחרונה ${L.date} (${L.complete?'הושלם':'לא הושלם'})`:''} · ${open} טרגטים פתוחים</span></button>`}).join('');
  return`<header class="bar">${brand()}<span class="spacer"></span><button class="ghost" data-a="settings">הגדרות וגיבוי</button><button class="ghost" data-a="lock">נעילה</button></header>
   ${msgHtml()}${draftHtml()}${bk}
   <div class="client"><h1>המטופלים שלי</h1></div>
   <div class="clist">${cards||'<p class="note">עדיין אין תיקים. מומלץ להשתמש בכינוי או בראשי תיבות במקום שם מלא.</p>'}</div>
   <div class="row" style="margin-top:18px"><button class="primary" data-a="newclient">תיק חדש</button>${DB.clients.some(c=>c.demo)?'':'<button class="ghost" data-a="demo">הוספת מטופלת לדוגמה (לתרגול)</button>'}</div>
   <p class="foot" style="margin-top:28px">הנתונים מוצפנים ונשמרים רק בטאבלט הזה. האפליקציה מציעה, המטפל/ת מחליט/ה.</p>`;
}
function renderClientForm(){
  const f=R.form;const BL=['תנועות עיניים','טאפינג','גירוי שמיעתי'];
  return`<header class="bar">${brand()}<span class="spacer"></span><button class="ghost" data-a="cf-cancel">ביטול</button></header>
  <div class="stage" style="max-width:720px;display:grid;gap:14px"><h2>${f.id?'עריכת פרטי התיק':'תיק חדש'}</h2>
   <div><label class="lbl" for="cf-name">שם או כינוי</label><input class="field" id="cf-name" value="${esc(f.name)}" autocomplete="off" placeholder="מומלץ: כינוי או ראשי תיבות"></div>
   <div><span class="lbl">נוסח התסריטים</span><span class="seg"><button data-a="cf-g" data-g="m" aria-pressed="${f.gender==='m'}">זכר</button><button data-a="cf-g" data-g="f" aria-pressed="${f.gender==='f'}">נקבה</button></span></div>
   <div><span class="lbl">גירוי בי-לטרלי מועדף</span><div class="chips">${BL.map(x=>`<button class="chip" data-a="cf-bls" data-v="${x}" aria-pressed="${f.bls===x}">${x}</button>`).join('')}</div></div>
   <div><label class="lbl" for="cf-dir">כיוון / הערות BLS</label><input class="field" id="cf-dir" value="${esc(f.dir)}" autocomplete="off"></div>
   <div><label class="lbl" for="cf-stop">סימן עצירה</label><input class="field" id="cf-stop" value="${esc(f.stop)}" autocomplete="off"></div>
   <div><label class="lbl" for="cf-problem">הנושא הטיפולי (אפשר גם בשלב 1)</label><input class="field" id="cf-problem" value="${esc(f.problem)}" autocomplete="off"></div>
   ${msgHtml()}<div class="row"><button class="primary" data-a="cf-save">${f.id?'שמירה':'יצירת התיק'}</button></div></div>`;
}
function renderSettings(){
  const days=daysSince(DB.lastBackup);
  return`<header class="bar">${brand()}<span class="spacer"></span><button class="ghost" data-a="clients">→ המטופלים</button><button class="ghost" data-a="lock">נעילה</button></header>
  ${msgHtml()}
  <div class="grid2">
   <section class="box" style="display:grid;gap:10px"><h2 class="sec-h">גיבוי מוצפן</h2>
    <p style="margin:0">${days===null?'עדיין לא נעשה גיבוי.':`גיבוי אחרון: לפני ${days} ימים.`} הקובץ מוצפן באותה סיסמה, ובלעדיה אי אפשר לקרוא אותו.</p>
    <p class="note" style="margin:0">כדי שהקבצים יישמרו ישר לכרטיס הזיכרון: ב-Chrome ← ⋮ ← הגדרות ← הורדות ← מיקום ההורדות ← כרטיס SD. אחרת אפשר להעביר את הקובץ באפליקציית הקבצים.</p>
    <button class="primary" data-a="backup">גיבוי עכשיו</button></section>
   <section class="box" style="display:grid;gap:10px"><h2 class="sec-h">שחזור</h2>
    <p style="margin:0">טעינת קובץ גיבוי במקום הנתונים הנוכחיים (למשל בטאבלט חדש).</p><button class="ghost" data-a="to-restore">שחזור מקובץ גיבוי</button></section>
   <section class="box" style="display:grid;gap:10px"><h2 class="sec-h">נעילה אוטומטית</h2>
    <p style="margin:0">אחרי זמן ללא נגיעה במסך, וגם כשהאפליקציה ברקע יותר משתי דקות.</p>
    <div class="chips">${[5,10,20,30].map(m=>`<button class="chip" data-a="lockmin" data-v="${m}" aria-pressed="${DB.settings.lockMin===m}">${m} דקות</button>`).join('')}</div></section>
   <section class="box" style="display:grid;gap:8px"><h2 class="sec-h">שינוי סיסמה</h2>
    <input class="field" type="password" id="cp0" placeholder="סיסמה נוכחית" autocomplete="current-password" aria-label="סיסמה נוכחית">
    <input class="field" type="password" id="cp1" placeholder="סיסמה חדשה" autocomplete="new-password" aria-label="סיסמה חדשה">
    <input class="field" type="password" id="cp2" placeholder="אימות סיסמה חדשה" autocomplete="new-password" aria-label="אימות סיסמה חדשה">
    <button class="ghost" data-a="chpw" ${R.busy?'disabled':''}>${R.busy||'עדכון סיסמה'}</button></section>
  </div>
  <section class="box" style="display:grid;gap:10px;margin-top:12px"><h2 class="sec-h">מחיקת כל הנתונים</h2>
   ${R.wipeArm?`<p style="margin:0">כל התיקים יימחקו מהטאבלט לצמיתות. קבצי גיבוי שכבר נשמרו לא נמחקים.</p><div class="row"><button class="danger" data-a="wipe">כן, למחוק הכול</button><button class="ghost" data-a="wipe-arm">ביטול</button></div>`:'<div><button class="ghost" data-a="wipe-arm">מחיקת כל הנתונים מהטאבלט</button></div>'}</section>`;
}
function homeFooter(){
  return`<section class="box" style="display:grid;gap:10px;margin-bottom:20px"><h2 class="sec-h">ניהול התיק</h2>
   <div class="row" style="margin:0"><button class="ghost" data-a="editclient">עריכת פרטים</button>${R.delArm?`<button class="danger" data-a="del-client">כן, למחוק את התיק של ${esc(D.client.name)} לצמיתות</button><button class="ghost" data-a="del-arm">ביטול</button>`:'<button class="ghost" data-a="del-arm">מחיקת התיק</button>'}</div></section>
   <p class="foot">הנתונים מוצפנים ונשמרים רק בטאבלט הזה. האפליקציה מציעה, המטפל/ת מחליט/ה. התסריטים מבוססים על Shapiro 2018, EMDR Institute ו-Leeds.</p>`;
}
function viewHtml(){
  if(!window.isSecureContext||!window.crypto||!crypto.subtle)return renderInsecure();
  if(R.view==='boot')return'';
  if(R.view==='setup')return renderSetup();
  if(R.view==='lock')return renderLock();
  if(R.view==='restore')return renderRestore();
  if(!DB){R.view='lock';return renderLock()}
  if(R.view==='clients')return renderClients();
  if(R.view==='clientform')return renderClientForm();
  if(R.view==='settings')return renderSettings();
  if(!D){R.view='clients';return renderClients()}
  return R.view==='home'?renderHome():R.view==='summary'?renderSummary():renderRun();
}
async function handleAsync(a,b){
  switch(a){
    case'lock':return lockNow();
    case'unlock':return doUnlock();
    case'setup':return doSetup();
    case'read-backup':return readBackup();
    case'apply-restore':return applyRestore();
    case'backup':return exportBackup();
    case'chpw':return changePw();
    case'wipe':return wipeAll();
  }
}
const ASYNC=['lock','unlock','setup','read-backup','apply-restore','backup','chpw','wipe'];
function handleApp(a,b){
  switch(a){
    case'forgot':R.forgot=!R.forgot;R.msg=null;R.wipeArm=false;render();return true;
    case'to-restore':R.prevView=R.view;R.view='restore';R.msg=null;R.info=null;pendingRestore=null;render();return true;
    case'cancel-restore':pendingRestore=null;R.msg=null;R.view=VK?'settings':(R.prevView||'setup');render();return true;
    case'settings':R.view='settings';R.msg=null;R.info=null;R.wipeArm=false;render();return true;
    case'clients':R.view='clients';R.msg=null;R.info=null;D=null;render();window.scrollTo(0,0);return true;
    case'open':D=DB.clients.find(c=>c.id===b.dataset.id);R.view='home';R.delArm=false;R.msg=null;R.info=null;render();window.scrollTo(0,0);return true;
    case'newclient':R.form={id:null,name:'',gender:'f',bls:'תנועות עיניים',dir:'אופקי',stop:'יד מורמת',problem:''};R.msg=null;R.view='clientform';render();return true;
    case'editclient':R.form={id:D.id,name:D.client.name,gender:D.client.gender,bls:D.client.bls.type,dir:D.client.bls.dir||'',stop:D.client.stop||'',problem:D.plan.problem||''};R.msg=null;R.view='clientform';render();return true;
    case'cf-g':syncForm();R.form.gender=b.dataset.g;render();return true;
    case'cf-bls':syncForm();R.form.bls=b.dataset.v;render();return true;
    case'cf-save':saveClientForm();return true;
    case'cf-cancel':R.msg=null;R.view=R.form&&R.form.id?'home':'clients';render();return true;
    case'demo':DB.clients.push(seed());render();return true;
    case'del-arm':R.delArm=!R.delArm;render();return true;
    case'del-client':DB.clients=DB.clients.filter(c=>c.id!==D.id);if(DB.draft&&DB.draft.clientId===D.id)DB.draft=null;D=null;R.view='clients';R.delArm=false;render();return true;
    case'resume-draft':resumeDraft();return true;
    case'drop-draft':DB.draft=null;render();return true;
    case'lockmin':DB.settings.lockMin=+b.dataset.v;bumpIdle();render();return true;
    case'wipe-arm':R.wipeArm=!R.wipeArm;render();return true;
  }
  return false;
}
(async function boot(){
  if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
  if(!window.isSecureContext||!window.crypto||!crypto.subtle){render();return}
  let env=null;try{env=await idbGet()}catch(e){}
  R.view=env?'lock':'setup';render();
})();
