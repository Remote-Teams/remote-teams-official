function generator(URL) {
    var splided_URL = URL.split('/')
   // console.log(splided_URL)
    var return_value;
    if(Number(splided_URL.length)==3){
            return_value =  "all"+splided_URL[2]                                                                                                                                                                                                                                              
        }
    if(Number(splided_URL.length)==4){
  
            return_value = splided_URL[2]+splided_URL[3]  
        
        if(splided_URL[3]=='count')
            return_value = splided_URL[2]+"Count"
    }
    if(Number(splided_URL.length)==5){
        return_value = splided_URL[2]+splided_URL[3]+splided_URL[4]
    }
    return return_value;
  }

  module.exports = generator;