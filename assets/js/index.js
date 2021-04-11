class Main {
    constructor (params) {
        this.name = params.name
    }

    sayHello() {
        console.log("Hello " + this.name)
    }
};


//The load event fires when a given resource has loaded.
window.onload = () => {
    console.log("All resource has loaded")
    let main = new Main({name: "Mariusz Najwer"})
    main.sayHello()
}

//The DOMContentLoaded event fires when the initial 
//HTML document has been completely loaded and parsed, 
//without waiting for stylesheets, images, and subframes
// to finish loading.
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
});