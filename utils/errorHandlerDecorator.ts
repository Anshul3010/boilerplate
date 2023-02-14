function catchError(target: any,propertyName: any,descriptor: any) {
    console.log('target------------------------',target)
    console.log('propertyName------------------------',propertyName)
    console.log('descriptor------------------------',descriptor)


    const method = descriptor.value;
    // descriptor.value = function(this: any, ...args: any) {
    //     console.log('args--------',args)
    //         return method.apply(this, args).catch((err: any) => {
    //             // return next(err)
    //             console.log('-----this----------', this.next)
    //             console.log(err);
    //             this.next('test error hola');
    //         });
    // };
    // return descriptor;
    let fn = function(this: any, ...args: any) {
    console.log('----------------------------------------------------s-s-s-s------------------',this)

        try {
            console.log(this,'---------x-xx-------------')
            method.apply(this,        ).catch((err: any) => {
                // console.log('this0----------------------', this.next.toString());/
                // console.log(err);
                console.log('-000000000000000000000--------------------------------------------------')
                this.next(err)
                console.log('-000000000000000000000--------------------------------------------------')

            })
        }
        catch(err) {
            console.log('------------------------------------cjcj-----------', err);
            this.next(err);
        }

        
    }

    descriptor.value = fn;
    return descriptor;
}

export default catchError