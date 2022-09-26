import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const storeCookies = (name, value) => {
  cookies.set(name, JSON.stringify(value),
    { path: "/" })

}

export const getCookies = (name) => {
  return cookies.get(name)

}
export const removeCookies = (name) => {
  return cookies.remove(name)

}

export const adminSideMenuLinks = [
    {
      name: "Events",
      link: "/admin/events",
      isShow: true
    },
    {
      name: "Places",
      link: "/admin/places",
      isShow: true
    },
    {
      name: "Contact",
      link: "/admin/contacts",
      isShow: true
    },
    {
      name: "Organization",
      link: "/admin/organization",
      isShow: true
    },
    {
      name: "Taxonomy",
      link: "/admin/taxonomy",
      isShow: true
    },
    {
      name: "Users",
      link: "/admin/users",
      isShow: true
    },
    {
      name: "Calendars",
      link: "/admin/calendars",
      isShow:false
    },
    
    
  ];
  export const convertDateFormat=(dateString)=>{
    if(dateString)
     return dateString.split("-").reverse().join("-");
    else
      return dateString 
  }

  export const  fbUrlValidate = (url) => {
    var expression =  /^(http|https):\/\/www.facebook.com\/.*/i;
    var regexp = new RegExp(expression);
    if(!url||url.length===0 )
        return true
    return regexp.test(url);
  }

  export const  urlValidate = (url) => {
    var expression = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    var regexp = new RegExp(expression);
    if(!url||url.length===0 )
        return true
    return regexp.test(url);
  }

  export const  videoUrlValidate = (url) => {
    
    var expression = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var regexp = new RegExp(expression);
    var newexp = /^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/;
    var regexpnew = new RegExp(newexp);
    if(!url||url.length===0 )
        return true    
    return regexp.test(url)||regexpnew.test(url);
  }

  export const adminContact=[
    {
      name: "name",
      title:"Name",
      required:true,
      placeHolder: "Enter Contact Name",
      type:"text",
      isMulti:false,
    },
    {
      name: "nameEn",
      title:"Name @en",
      required:true,
      placeHolder: "Enter Contact Name",
      type:"text",
      isMulti:true
    },
    {
      name: "description",
      title:"Description",
      required:false,
      placeHolder: "Enter Description",
      type:"area",
      isMulti:false
    },
    {
      name: "descriptionEn",
      title:"Description @en",
      required:false,
      placeHolder: "Enter Description",
      type:"area",
      isMulti:true
    },
    {
      name: "url",
      title:"Site Web",
      required:true,
      placeHolder: "Enter Url",
      type:"text",
      isMulti:false
    },
    {
      name: "email",
      title:"Email",
      required:false,
      placeHolder: "Enter email",
      type:"text",
      isMulti:false
    },
    {
      name: "telephone",
      title:"Telephone",
      required:false,
      placeHolder: "Enter Telephone",
      type:"text",
      isMulti:false
    },
    
  ]
  
  export const adminOrg=[
    {
      name: "name",
      title:"Name",
      required:true,
      placeHolder: "Enter Orgnization Name",
      type:"text",
      isMulti:false
    },
    {
      name: "nameEn",
      title:"Name @en",
      required:true,
      placeHolder: "Enter Orgnization Name",
      type:"text",
      isMulti:true
    },
    {
      name: "description",
      title:"Description",
      required:false,
      placeHolder: "Enter Description",
      type:"area",
      isMulti:false
    },
    {
      name: "descriptionEn",
      title:"Description @en",
      required:false,
      placeHolder: "Enter Description",
      type:"area",
      isMulti:true
    },
    {
      name: "url",
      title:"Site Web",
      required:false,
      placeHolder: "Enter Url",
      type:"text",
      isMulti:false
    },
  
    {
      name: "contact",
      title:"Contact",
      required:false,
      placeHolder: "Select Contact",
      type:"select",
      isMulti:false
    },
    
  ]

  export const adminTaxonomy=[
    {
      name: "name",
      title:"Name",
      required:true,
      placeHolder: "Enter Taxonomy Name",
      type:"text",
      isMulti:false
    },
    {
      name: "nameEn",
      title:"Name @en",
      required:true,
      placeHolder: "Enter Taxonomy Name",
      type:"text",
      isMulti:true
    },
    {
      name: "url",
      title:"Identifier",
      required:true,
      placeHolder: "Enter Url",
      type:"text",
      isMulti:false
    },
  
    {
      name: "conceptScheme",
      title:"Concept Scheme",
      required:true,
      placeHolder: "Select Concept",
      type:"select",
      isMulti:false
    },
    {
      name: "broader",
      title:"Broader",
      required:false,
      placeHolder: "Select Contact",
      type:"Treeselect",
      isMulti:false
    },
    
  ]
  export const adminPlaces = [
    {
      name: "name",
      title:"Name",
      required:true,
      placeHolder: "Enter Place Name",
      type:"geo",
      isMulti:false,
    },
    {
      name: "nameEn",
      title:"Name @en",
      required:true,
      placeHolder: "Enter Place Name",
      type:"geo",
      isMulti:true
    },
    {
      name: "addressCountry",
      title:"Country",
      required:true,
      placeHolder: "Enter Country",
      type:"text",
      isMulti:false,
    },
    {
      name: "addressLocality",
      title:"Locality",
      required:true,
      placeHolder: "Enter Locality",
      type:"text",
      isMulti:false,
    },
    {
      name: "addressRegion",
      title:"Region",
      required:true,
      placeHolder: "Enter Region",
      type:"text",
      isMulti:false,
    },
    {
      name: "postalCode",
      title:"PostalCode",
      required:true,
      placeHolder: "Enter Postal code",
      type:"text",
      isMulti:false,
    },
    {
      name: "streetAddress",
      title:"StreetAddress",
      required:true,
      placeHolder: "Enter Street Address",
      type:"text",
      isMulti:false,
    },
    {
      name: "latitude",
      title:"Latitude",
      required:false,
      placeHolder: "Enter Latitude",
      type:"text",
      isMulti:false,
    },
    {
      name: "longitude",
      title:"Longitude",
      required:false,
      placeHolder: "Enter Longitude",
      type:"text",
      isMulti:false,
    },
    {
      name: "description",
      title:"Description",
      required:false,
      placeHolder: "Enter Description",
      type:"area",
      isMulti:false,
    },
    {
      name: "descriptionEn",
      title:"Description @en",
      required:false,
      placeHolder: "Enter Description",
      type:"area",
      isMulti:true,
    },
    {
      name: "containedInPlace",
      title:"ContainedInPlace",
      required:false,
      placeHolder: "Enter containedInPlace",
      type:"select",
      isMulti:false,
    },
    
    
    
  ];

  export const priceDollarType =[
    {
      name:"Canadian Dollar (CAD)",
      value:"CAD"
    },
    {
      name:"US Dollar (USD)",
      value:"USD"
    },
  ]

  export const timeZone =[
    {
      name:"Canada/Newfoundland",
      value:"Canada/Newfoundland"
    },
    {
      name:"Canada/Atlantic",
      value:"Canada/Atlantic"
    },
    {
      name:"Canada/Eastern",
      value:"Canada/Eastern"
    },
    {
      name:"Canada/Central",
      value:"Canada/Central"
    },
		{
      name:"Canada/Mountain",
      value:"Canada/Mountain"
    },	
		{
      name:"Canada/Saskatchewan",
      value:"Canada/Saskatchewan"
    },		
		{
      name:"Canada/Yukon",
      value:"Canada/Yukon"
    },	
		{
      name:"Canada/Pacific",
      value:"Canada/Pacific"
    },	
			
			
			
  ]
  export const daysOfWeek=[
      {
        name:"Monday",
        value:"Monday"
      },
      {
        name:"Tuesday",
        value:"Tuesday"
      },
      {
        name:"Wednesday",
        value:"Wednesday"
      },
      {
        name:"Thursday",
        value:"Thursday"
      },
      {
        name:"Friday",
        value:"Friday"
      },
      {
        name:"Saturday",
        value:"saturday"
      },
      {
        name:"Sunday",
        value:"sunday"
      },
    ]
  
    export const publics=[{"uri":"https://cultureoutaouais.com/resource/audience#GrandPublic","name":{"en":"General public","fr":"Grand public"}},{"uri":"https://cultureoutaouais.com/resource/audience#GroupesEnfants","name":{"en":"Children","fr":"Enfants"}},{"uri":"https://cultureoutaouais.com/resource/audience#Elders","name":{"en":"Elders","fr":"Aîné·e·s"}},{"uri":"https://cultureoutaouais.com/resource/audience#Adults","name":{"en":"Adults","fr":"Adultes"}},{"uri":"https://cultureoutaouais.com/resource/audience#Ado","name":{"en":"Teens","fr":"Adolescent·e·s"}}]

    
  export const adminResetPassword=[
  
    
  ]

  export const adminLogin=[
    
    {
      name: "email",
      title:"Email",
      required:true,
      placeHolder: "Enter email",
      inputtype:"email",
      type:"login"
      
    },
    {
      name: "password",
      title:"Password",
      required:true,
      placeHolder: "Enter password",
      inputtype:"password",
      type:"login"
    },
    {
      name: "email",
      title:"Email",
      required:true,
      placeHolder: "Enter email",
      inputtype:"email",
      type:"resetLink"
    },
    {
      name: "email",
      title:"Email",
      required:true,
      placeHolder: "Enter email",
      inputtype:"email",
      type:"reset"
    },
    {
      name: "oneTimePassword",
      title:"6-digit one-time code",
      required:true,
      placeHolder: "Enter one time code",
      inputtype:"text",
      type:"reset"
    },
    {
      name: "newPassword",
      title:"New Password",
      required:true,
      placeHolder: "Enter new password",
      inputtype:"password",
      type:"reset"
    },
    {
      name: "confirmPassword",
      title:"Confirm password",
      required:true,
      placeHolder: "Enter confirm password",
      inputtype:"password",
      type:"reset"
    },
    {
      name: "firstName",
      title:"First Name",
      required:true,
      placeHolder: "Enter first name",
      inputtype:"text",
      type:"register",
      disabled: true
    },
    {
      name: "lastName",
      title:"Last Name",
      required:true,
      placeHolder: "Enter last name",
      inputtype:"test",
      type:"register",
      disabled: true
    },
    {
      name: "password",
      title:"Password",
      required:true,
      placeHolder: "Enter password",
      inputtype:"password",
      type:"register"
    },
    {
      name: "email",
      title:"Email",
      required:true,
      placeHolder: "Enter email",
      inputtype:"email",
      type:"register",
      disabled: true
    },
    
  ]

  export const adminCalendar=[
    {
      name: "name",
      title:"Name",
      required:true,
      placeHolder: "Enter name",
      inputtype:"text",
      type:"register"
    },
    {
      name: "interfaceLanguage",
      title:"Content Language",
      required:false,
      placeHolder: "Enter language",
      inputtype:"select",
      type:"select"
    },
    {
      name: "contact",
      title:"Contact",
      required:true,
      placeHolder: "Enter contact",
      inputtype:"text",
      type:"register"
    },
  ]

  export const adminProfile=[
    
    
    {
      name: "firstName",
      title:"First Name",
      required:true,
      placeHolder: "Enter first name",
      inputtype:"auto",
      type:"register"
    },
    {
      name: "lastName",
      title:"Last Name",
      required:true,
      placeHolder: "Enter last name",
      inputtype:"test",
      type:"register"
    },
    
    {
      name: "email",
      title:"Email",
      required:true,
      placeHolder: "Enter email",
      inputtype:"email",
      type:"register"
    },
    {
      name: "interfaceLanguage",
      title:"Interface Language",
      required:false,
      placeHolder: "Enter language",
      inputtype:"select",
      type:"register"
    },
    {
      name: "role",
      title:"Role",
      required:false,
      placeHolder: "Enter role",
      inputtype:"select",
      type:"register"
    },
  ]

  export const updatePasswordAdmin =[
    {
      name: "currentPassword",
      title:"Old Password",
      required:true,
      placeHolder: "Enter new password",
      inputtype:"password",
      type:"reset"
    },
    {
      name: "newPassword",
      title:"New Password",
      required:true,
      placeHolder: "Enter new password",
      inputtype:"password",
      type:"reset"
    },
    {
      name: "confirmPassword",
      title:"Confirm password",
      required:true,
      placeHolder: "Enter confirm password",
      inputtype:"password",
      type:"reset"
    },
  ]