function catchError(target: any,propertyName: any,descriptor: any) {
    const method = descriptor.value;
    let fn = function(this: any, ...args: any) {
            return method.call(this,...args).catch((err: any) => {
                return this.next(err)
            })
    }

    descriptor.value = fn;
    return descriptor;
}

export default catchError