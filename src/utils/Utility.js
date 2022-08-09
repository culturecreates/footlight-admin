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
    },
    {
      name: "Places",
      link: "/admin/places",
    },
    {
      name: "Contact",
      link: "/admin/contacts",
    },
    {
      name: "Organization",
      link: "/admin/organization",
    },
    {
      name: "Taxonomy",
      link: "/admin/taxonomy",
    },
    {
      name: "Users",
      link: "/admin/users",
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

  export const adminContact=[
    {
      name: "name",
      title:"Name",
      required:true,
      placeHolder: "Enter Contact Name",
      type:"text"
    },
    {
      name: "description",
      title:"Description",
      required:false,
      placeHolder: "Enter Description",
      type:"area"
    },
    {
      name: "url",
      title:"Site Web",
      required:true,
      placeHolder: "Enter Url",
      type:"text"
    },
    {
      name: "email",
      title:"Email",
      required:false,
      placeHolder: "Enter email",
      type:"text"
    },
    {
      name: "telephone",
      title:"Telephone",
      required:false,
      placeHolder: "Enter Telephone",
      type:"text"
    },
    
  ]
  
  export const adminOrg=[
    {
      name: "name",
      title:"Name",
      required:true,
      placeHolder: "Enter Orgnization Name",
      type:"text"
    },
    {
      name: "description",
      title:"Description",
      required:false,
      placeHolder: "Enter Description",
      type:"area"
    },
    {
      name: "url",
      title:"Site Web",
      required:false,
      placeHolder: "Enter Url",
      type:"text"
    },
  
    {
      name: "contact",
      title:"Contact",
      required:false,
      placeHolder: "Select Contact",
      type:"select"
    },
    
  ]

  export const adminTaxonomy=[
    {
      name: "name",
      title:"Name",
      required:true,
      placeHolder: "Enter Taxonomy Name",
      type:"text"
    },
    {
      name: "url",
      title:"Identifier",
      required:true,
      placeHolder: "Enter Url",
      type:"text"
    },
  
    {
      name: "conceptScheme",
      title:"Concept Scheme",
      required:true,
      placeHolder: "Select Concept",
      type:"select"
    },
    {
      name: "broader",
      title:"Broader",
      required:true,
      placeHolder: "Select Contact",
      type:"Treeselect"
    },
    
  ]
  export const adminPlaces = [
    {
      name: "name",
      title:"PlaceName",
      required:true,
      placeHolder: "Enter Place Name",
      type:"geo"
    },
    {
      name: "addressCountry",
      title:"Country",
      required:true,
      placeHolder: "Enter Country",
      type:"text"
    },
    {
      name: "addressLocality",
      title:"Locality",
      required:true,
      placeHolder: "Enter Locality",
      type:"text"
    },
    {
      name: "addressRegion",
      title:"Region",
      required:true,
      placeHolder: "Enter Region",
      type:"text"
    },
    {
      name: "postalCode",
      title:"PostalCode",
      required:true,
      placeHolder: "Enter Postal code",
      type:"text"
    },
    {
      name: "streetAddress",
      title:"StreetAddress",
      required:true,
      placeHolder: "Enter Street Address",
      type:"text"
    },
    {
      name: "latitude",
      title:"Latitude",
      required:false,
      placeHolder: "Enter Latitude",
      type:"text"
    },
    {
      name: "longitude",
      title:"Longitude",
      required:false,
      placeHolder: "Enter Longitude",
      type:"text"
    },
    {
      name: "description",
      title:"Description",
      required:false,
      placeHolder: "Enter Description",
      type:"area"
    },
    {
      name: "containedInPlace",
      title:"ContainedInPlace",
      required:false,
      placeHolder: "Enter containedInPlace",
      type:"select"
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
      name: "code",
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
      type:"register"
    },
    
  ]

  export const adminProfile=[
    
    
    {
      name: "firstName",
      title:"First Name",
      required:true,
      placeHolder: "Enter first name",
      inputtype:"text",
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
  ]