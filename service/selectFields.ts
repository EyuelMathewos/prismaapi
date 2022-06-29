export function selectedFields (fields? : any, ALL_FIELDS ?: any ) {
    let newFields: any ={};
        for (const key in fields) {
            let name = fields[key];
            if(typeof name == 'string' ){
              newFields[name] = true;
            }
            else{
                newFields= {};
                for (const key in ALL_FIELDS) {
                    let name = ALL_FIELDS[key];
                    if(typeof name == 'string' ){
                      newFields[name] = true;
                    }
                }
            }
        };
        return newFields;
  };