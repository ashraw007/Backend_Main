(this["webpackJsonpstd-login"]=this["webpackJsonpstd-login"]||[]).push([[0],{118:function(e,t,a){},142:function(e,t,a){"use strict";a.r(t);var n=a(2),s=a(0),r=a.n(s),o=a(10),i=a.n(o),c=(a(118),a(22)),d=a(23),l=a(25),u=a(24),h=a(100),j=a(198),b=a(144),f=Object(h.a)((function(e){return{margin:{margin:e.spacing(1)},extendedIcon:{marginRight:e.spacing(1)},Center:{display:"flex",width:"100%",justifyContent:"center"}}})),p=function(e){var t=f();return Object(n.jsx)("div",{className:t.Center,children:Object(n.jsx)(b.a,{variant:"contained",size:"large",color:"primary",className:t.margin,onClick:e.Submit,children:"login"})})},m=a(26),g=Object(h.a)((function(e){return{root:{"& > *":{width:"30ch",display:"flex",flexWrap:"wrap",justifyContent:"center"}},Fields:{width:"100%",display:"flex",justifyContent:"center",flexDirection:"column","& > *":{margin:"2% 0%"}}}})),x=function(e){var t=g();return Object(n.jsx)("form",{className:t.root,autoComplete:"off",children:Object(n.jsxs)("div",{className:t.Fields,children:[Object(n.jsx)(j.a,{required:!0,value:e.id,onChange:e.changeId,id:"outlined-basic",type:"text",label:"Roll Number",variant:"outlined"}),Object(n.jsx)(j.a,{required:!0,value:e.password,onChange:e.changePassword,id:"outlined-basic",type:"password",label:"Password",variant:"outlined"}),Object(n.jsx)(m.b,{to:"/forgot-password",style:{justifyContent:"flex-start",color:"blue",textDecoration:"none"},children:"Forgot Password !"}),Object(n.jsx)(p,{Submit:e.Submit})]})})},w=a.p+"static/media/Avatar.6ae11af0.png",O=a(95),y=a.n(O),v=function(){return Object(n.jsx)("div",{className:y.a.stdimg,children:Object(n.jsx)("img",{alt:"std",src:w,width:"35%"})})},_=a(188),C=a(96),k=a.n(C),N=a(40),P=function(e){return Object(n.jsx)(N.a,{width:"30%",isNotWidth:!0,extraStyles:{zIndex:2},children:Object(n.jsx)("div",{className:k.a.Login,children:Object(n.jsx)("div",{children:Object(n.jsxs)(_.a,{children:[Object(n.jsx)(v,{}),Object(n.jsx)(x,{id:e.id,password:e.password,changeId:e.idHandler,changePassword:e.passwordHandler,Submit:e.loginHandler})]})})})})},S=a(64),F=a.n(S),L=a(38),M=a(39),A=function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(){var e;Object(c.a)(this,a);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return(e=t.call.apply(t,[this].concat(s))).state={id:"",password:"",isInvalid:!1,errorMessage:""},e.idChangeHandler=function(t){e.setState({id:t.target.value})},e.passwordChangeHandler=function(t){e.setState({password:t.target.value})},e.onLoginHandler=function(){L.a.post("/api/student/auth/login",{rollNumber:e.state.id,password:e.state.password},{withCredentials:!0}).then((function(t){!0===t.data.isSuccess&&e.props.refresh()})).catch((function(t){e.setState({isInvalid:!0,errorMessage:t.errorMessage}),setTimeout((function(){e.setState({isInvalid:!1,errorMessage:""})}),3200)}))},e}return Object(d.a)(a,[{key:"render",value:function(){var e=this;return Object(n.jsxs)("div",{className:F.a.Container,children:[Object(n.jsx)("div",{className:F.a.Background}),Object(n.jsx)("div",{className:F.a.Layout,children:Object(n.jsx)(P,{email:this.state.id,password:this.state.password,idHandler:function(t){return e.idChangeHandler(t)},passwordHandler:function(t){return e.passwordChangeHandler(t)},loginHandler:function(){return e.onLoginHandler()}})}),this.state.isInvalid?Object(n.jsx)(M.a,{message:this.state.errorMessage,type:"error"}):null]})}}]),a}(s.Component),I=a(145),B=a(192),H=a(98),q=a.n(H),W=Object(h.a)((function(e){return{root:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",minHeight:"100vh",width:"60%"},margin:{margin:e.spacing(1),width:"100%"},width:{width:"100%"}}})),R=function(e){var t=W();return Object(n.jsx)("div",{className:"".concat(t.root,", ").concat(q.a.Min),children:Object(n.jsxs)(N.a,{extraStyles:{zIndex:2,padding:"8%"},children:[Object(n.jsx)("form",{children:Object(n.jsxs)(_.a,{className:t.margin,children:[Object(n.jsx)(I.a,{variant:"h5",style:{fontWeight:"bold"},children:"Change Account Password"}),Object(n.jsx)(B.a,{container:!0,spacing:1,alignItems:"flex-end",children:Object(n.jsx)(B.a,{item:!0,className:t.width,children:Object(n.jsx)(j.a,{value:e.value,onChange:function(t){e.inputHandler(t.target.value)},id:"input-with-icon-grid",fullWidth:!0,label:"Your RollNumber "})})})]})}),Object(n.jsx)("div",{style:{display:"flex",width:"100%",justifyContent:"center"},children:Object(n.jsx)(b.a,{variant:"contained",onClick:e.submit,color:"primary",style:{borderRadius:4},children:"Reset Password"})})]})})},T=a(65),D=a.n(T),Q=function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(){var e;Object(c.a)(this,a);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return(e=t.call.apply(t,[this].concat(s))).state={rollNumber:"",showSnackbar:!1,message:"",type:""},e.rollNumberChangeHandler=function(t){e.setState({rollNumber:t})},e.ResetPassword=function(){L.a.post("/api/student/auth/resetpwd",{rollNumber:e.state.rollNumber}).then((function(t){e.setState({showSnackbar:!0,message:t.data.message,type:"info"}),setTimeout((function(){e.setState({showSnackbar:!1,message:"",type:""})}),3200)})).catch((function(t){e.setState({showSnackbar:!0,message:t.errorMessage,type:"error"}),setTimeout((function(){e.setState({showSnackbar:!1,message:"",type:""})}),3200)}))},e}return Object(d.a)(a,[{key:"render",value:function(){return Object(n.jsxs)("div",{className:D.a.Container,children:[Object(n.jsx)("div",{className:D.a.Background}),Object(n.jsxs)("div",{className:D.a.Layout,children:[Object(n.jsx)(R,{inputHandler:this.rollNumberChangeHandler,value:this.state.rollNumber,submit:this.ResetPassword}),!0===this.state.showSnackbar?Object(n.jsx)(M.a,{message:this.state.message,type:this.state.type}):null]})]})}}]),a}(s.Component),z=a(11),V=a(94),J=a(66),E=a.n(J),Y=a(52),G=a.n(Y),K=function(e){return Object(n.jsx)("div",{className:G.a.Layout,children:Object(n.jsx)(N.a,{extraStyles:{zIndex:2,margin:"2%"},children:Object(n.jsxs)("div",{className:G.a.Padded,children:[Object(n.jsx)("h1",{children:"Enter new password !"}),Object(n.jsx)(j.a,{required:!0,className:G.a.Padded,id:"filled-required",type:"password",label:"New password here",defaultValue:e.pwd,onChange:function(t){e.handlePwdChange(t.target.value)},variant:"filled"}),Object(n.jsx)(j.a,{required:!0,id:"filled-required",label:"Confirm password !",type:"password",className:G.a.Padded,defaultValue:e.confirmPwd,onChange:function(t){e.handleConfirmPwdChange(t.target.value)},variant:"filled"}),Object(n.jsx)(b.a,{onClick:e.submit,variant:"contained",color:"secondary",children:"Change password"})]})})})},U=function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(){var e;Object(c.a)(this,a);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return(e=t.call.apply(t,[this].concat(s))).state={password:"",token:null,error:!1,type:"",errorMessage:"",comfirmPassword:null},e.handlePasswordChange=function(t){e.setState({password:t})},e.handleConfirmPasswordChange=function(t){e.setState({comfirmPassword:t})},e.updatePassword=function(t){return e.state.password.length<7||null===e.state.password?(e.setState({error:!0,errorMessage:"Password Cannot be smaller than 7 characters",type:"warning"}),setTimeout((function(){e.setState({error:!1,errorMessage:"",type:""})}),3200),0):e.state.password!==e.state.comfirmPassword?(e.setState({error:!0,errorMessage:"Passwords didn't match",type:"warning"}),setTimeout((function(){e.setState({error:!1,errorMessage:"",type:""})}),3200),0):void L.a.patch("/api/student/auth/resetpwd/"+encodeURI(e.state.token),{password:e.state.password}).then((function(t){e.setState({error:!0,errorMessage:"Password Changed !",type:"success"}),setTimeout((function(){e.setState({error:!1,errorMessage:"",type:""})}),3200)})).catch((function(t){e.setState({error:!0,errorMessage:t.errorMessage,type:"error"}),setTimeout((function(){e.setState({error:!1,errorMessage:"",type:""})}),3200)}))},e}return Object(d.a)(a,[{key:"componentDidMount",value:function(){this.state.token||this.setState({token:this.props.match.params.id})}},{key:"render",value:function(){return Object(n.jsxs)("div",{className:E.a.Container,children:[Object(n.jsx)("div",{className:E.a.Background}),Object(n.jsxs)("div",{className:E.a.Layout,children:[!0===this.state.changed?Object(n.jsx)(z.a,{to:"/"}):null,Object(n.jsx)(K,{submit:this.updatePassword,pwd:this.state.password,confirmPwd:this.state.comfirmPassword,handlePwdChange:this.handlePasswordChange,handleConfirmPwdChange:this.handleConfirmPasswordChange})]}),!0===this.state.error?Object(n.jsx)(M.a,{message:this.state.errorMessage,type:this.state.type}):null]})}}]),a}(s.Component),Z=a(69),X=a.n(Z),$=a(28),ee=a.n($),te=a(193),ae=function(e){var t=Object(n.jsx)(I.a,{variant:"h6",children:Object(n.jsx)(m.b,{className:ee.a.Links,to:"/FAQ",children:"FAQ"})});return"/FAQ"===e.location.pathname&&(t=Object(n.jsx)(I.a,{variant:"h6",children:Object(n.jsx)(m.b,{className:ee.a.Links,to:"/",children:"Login"})})),Object(n.jsx)(te.a,{className:ee.a.Footer,children:Object(n.jsxs)("div",{className:ee.a.FooterLayout,children:[Object(n.jsxs)("div",{className:ee.a.MadeBy,children:[Object(n.jsx)(I.a,{align:"center",children:"Made by"}),Object(n.jsxs)(I.a,{align:"center",children:["  ",Object(n.jsx)("a",{className:"".concat(ee.a.Links,", ").concat(ee.a.Names),rel:"noopener noreferrer",target:"_blank",href:"https://www.linkedin.com/in/ashish-rawat-2226a7197/",children:"Ashish Singh Rawat "})," & ",Object(n.jsx)("a",{className:"".concat(ee.a.Links,", ").concat(ee.a.Names),rel:"noopener noreferrer",target:"_blank",href:"https://www.linkedin.com/in/garvitvij/",children:"Garvit Vij"})]})]}),Object(n.jsx)("div",{children:t})]})})},ne=a(99),se=a.n(ne),re=a(194),oe=a(195),ie=Object(h.a)({root:{minWidth:275,margin:"1% 0%",backgroundColor:"#D0D0D0"},bullet:{display:"inline-block",margin:"0 2px",transform:"scale(0.8)"},Que:{fontSize:25,fontFamily:"Inconsolata",fontWeight:600},Ans:{fontSize:20,fontFamily:"Inconsolata",fontWeight:400},pos:{marginBottom:12}}),ce=function(e){var t=ie(),a="Q. ".concat(e.que),s="A. ".concat(e.ans);return Object(n.jsx)(re.a,{className:t.root,variant:"outlined",children:Object(n.jsxs)(oe.a,{children:[Object(n.jsx)(I.a,{className:t.Que,gutterBottom:!0,children:a}),Object(n.jsx)(I.a,{className:t.Ans,component:"h2",children:s})]})})},de=[{que:"Whats the default password ?",ans:"The default password is 1st four alphabet of your name and last 4 digits of your roll number"},{que:"How to I change my password ?",ans:"Use the forgot password to change your password"},{que:"What to do if payment fails ? ( Money deducted)",ans:"Contact college for further assistance"},{que:"Whats the best time to pay fee ?",ans:"Atleast 9 Days before, so if any technical error occurs if could be fixed"},{que:"Before paying fee !, its shows prompt to screen shot receipt ID ! why ?",ans:"Just because if any technical issues occurs! it would be easier to locate what happened ! (PS: delete it if payment went successfull)"},{que:"Where is my receipt ?",ans:"Kindly wait for 24 hours, if after 24 hours its still not visible contact college !"}],le=function(e){return Object(n.jsxs)(r.a.Fragment,{children:[Object(n.jsx)(I.a,{variant:"h2",align:"center",style:{fontFamily:"'Roboto', sans-serif",fontWeight:800},children:"FAQ !"}),Object(n.jsx)(I.a,{variant:"h6",align:"center",children:"Use ctrl+f / Find"}),Object(n.jsx)("div",{className:se.a.FAQ,children:de.map((function(e,t){return Object(n.jsx)(ce,{que:e.que,ans:e.ans},t)}))})]})},ue=r.a.lazy((function(){return Promise.all([a.e(3),a.e(4)]).then(a.bind(null,260))})),he=function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(){var e;Object(c.a)(this,a);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return(e=t.call.apply(t,[this].concat(s))).state={isAuthenticated:!1},e.checkValidity=function(){X.a.get("token")&&e.setState({isAuthenticated:!0})},e}return Object(d.a)(a,[{key:"componentDidMount",value:function(){X.a.get("token")&&this.setState({isAuthenticated:!0})}},{key:"render",value:function(){var e=this,t=Object(n.jsxs)(z.d,{children:[Object(n.jsx)(z.b,{exact:!0,path:"/reset-password/:id",component:U}),Object(n.jsx)(z.b,{exact:!0,path:"/forgot-password",component:Q}),Object(n.jsx)(z.b,{exact:!0,path:"/FAQ",component:le}),Object(n.jsx)(z.b,{exact:!0,path:"/",render:function(){return Object(n.jsx)(A,{refresh:e.checkValidity})}}),Object(n.jsx)(z.b,{component:V.a})]});return this.state.isAuthenticated&&(t=Object(n.jsx)(s.Suspense,{fallback:Object(n.jsx)("div",{children:"Loading..."}),children:Object(n.jsx)(ue,{})})),Object(n.jsxs)("div",{children:[t,this.state.isAuthenticated?null:Object(n.jsx)(z.b,{component:ae})]})}}]),a}(s.Component),je=function(e){e&&e instanceof Function&&a.e(5).then(a.bind(null,259)).then((function(t){var a=t.getCLS,n=t.getFID,s=t.getFCP,r=t.getLCP,o=t.getTTFB;a(e),n(e),s(e),r(e),o(e)}))};i.a.render(Object(n.jsx)(m.a,{children:Object(n.jsx)(r.a.StrictMode,{children:Object(n.jsx)(he,{})})}),document.getElementById("root")),je()},28:function(e,t,a){e.exports={Footer:"Footer_Footer__3jyx0",FooterLayout:"Footer_FooterLayout__ddvt5",MadeBy:"Footer_MadeBy__3Zek5",Links:"Footer_Links__Mhq-3",Names:"Footer_Names__1LztW"}},38:function(e,t,a){"use strict";var n=a(33),s=a(97),r=a.n(s).a.create({});r.interceptors.response.use((function(e){return e}),(function(e){if("Network Error"===e.message){var t={response:{}};return t.response.data={},t.response.data.errorMessage="Kindly check your internet, if problem presist. contact collage",Promise.reject(Object(n.a)({},t.response.data))}return e.response?(e.response.data&&401===e.response.status&&"Please Authenticate"===e.response.data.error&&(window.location.href="/"),Promise.reject(Object(n.a)({},e.response.data))):Promise.reject()})),t.a=r},39:function(e,t,a){"use strict";a.d(t,"a",(function(){return j}));var n=a(77),s=a(33),r=a(2),o=a(0),i=a.n(o),c=a(148),d=a(147),l=a(100);function u(e){return Object(r.jsx)(d.a,Object(s.a)({elevation:6,variant:"filled"},e))}var h=Object(l.a)((function(e){return{root:{width:"100%",zIndex:"20","& > * + *":{marginTop:e.spacing(2)}}}}));function j(e){var t=h(),a=i.a.useState(!0),s=Object(n.a)(a,2),o=s[0],d=s[1],l=function(e,t){"clickaway"!==t&&d(!1)};return Object(r.jsx)("div",{className:t.root,children:Object(r.jsx)(c.a,{open:o,autoHideDuration:e.time||3e3,onClose:l,children:Object(r.jsx)(u,{onClose:l,severity:e.type,children:e.message})})})}},40:function(e,t,a){"use strict";var n=a(2),s=a(33),r=(a(0),a(100)),o=a(102);t.a=function(e){var t=Object(r.a)((function(t){return{root:{display:"flex",flexWrap:"wrap",width:e.isNotWidth?null:"100%",minWidth:e.isNotWidth?e.width:"100%",justifyContent:"center","& > *":Object(s.a)({margin:t.spacing(1),width:"100%",height:"100%"},e.extraStyles)}}}))();return Object(n.jsx)("div",{className:t.root,children:Object(n.jsx)(o.a,{elevation:23,children:e.children})})}},52:function(e,t,a){e.exports={Layout:"ResetPassword_Layout__14S56",Padded:"ResetPassword_Padded__2tLSk"}},64:function(e,t,a){e.exports={Container:"login_Container__6eolL",Layout:"login_Layout__1Jpfp",Background:"login_Background__vmunO"}},65:function(e,t,a){e.exports={Container:"Password_Container__3yTjS",Layout:"Password_Layout__aV3NR",Background:"Password_Background__YGcMj",Text:"Password_Text__3nJgE"}},66:function(e,t,a){e.exports={Container:"ResetPassword_Container__3MLVV",Layout:"ResetPassword_Layout__1nqoh",Background:"ResetPassword_Background__lK_qV"}},72:function(e,t,a){e.exports={F0F:"FourOFour_F0F__IS3rG",Button:"FourOFour_Button__32Rw_"}},94:function(e,t,a){"use strict";var n=a(2),s=a(22),r=a(23),o=a(25),i=a(24),c=a(72),d=a.n(c),l=a(145),u=a(144),h=a(0),j=a.n(h),b=a(11),f=function(e){Object(o.a)(a,e);var t=Object(i.a)(a);function a(){var e;Object(s.a)(this,a);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={clicked:!1},e.clicked=function(){e.setState({clicked:!0})},e}return Object(r.a)(a,[{key:"render",value:function(){var e=!0===this.state.clicked?Object(n.jsx)(b.a,{to:"/"}):null;return Object(n.jsxs)("div",{className:d.a.F0F,children:[e,Object(n.jsx)(l.a,{variant:"h3",align:"center",children:"Oops, You are here ! Doesnt seem a valid page !\ud83e\udd14"}),Object(n.jsxs)(u.a,{className:d.a.Button,onClick:this.clicked,children:[Object(n.jsx)("h4",{children:"Lets go to some that works ! click me\ud83d\ude00 "})," "]})]})}}]),a}(j.a.Component);t.a=f},95:function(e,t,a){e.exports={stdimg:"studentimage_stdimg__3qR54"}},96:function(e,t,a){e.exports={Login:"loginpage_Login__1WWHs"}},98:function(e,t,a){e.exports={Min:"ForgotPassword_Min__EfJzY"}},99:function(e,t,a){e.exports={FAQ:"FAQ_FAQ__1T1rO"}}},[[142,1,2]]]);
//# sourceMappingURL=main.0992e103.chunk.js.map