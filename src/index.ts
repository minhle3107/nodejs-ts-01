type Handle = () => Promise<string>
const fullName: string = 'Lê Minh'
// console.log(fullName)
const handle: Handle = async () => Promise.resolve(fullName)

handle().then(console.log)
