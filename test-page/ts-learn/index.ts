



function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);// Property length does not exist on type 'Type'
  return arg;
}