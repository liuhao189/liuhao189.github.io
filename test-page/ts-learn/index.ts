const nameStr: String = '';
const x = 'hello' as unknown as number;
let y: "hello" = "hello"
y = "howdy"

function printText(s: string, alignment: "left" | "right" | "center") {
    //...
}
printText("Hello, world", "left");
printText("G'day, mate", "center");

const req = { url: "https://example.com", method: "GET" } as const;

function handleRequest(method: "GET" | "POST") {

}

handleRequest(req.method);