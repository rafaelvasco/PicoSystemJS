import App from 'components/App';
import 'main.css';

const main = async () => {
    const app = new App();
    app.init();
}

main().then(() => console.log("%c\u0020%c\u0020%c\u0020 :: PicoSystem ::", "background-color: red;padding: 2px", "background-color: green; padding: 2px", "background-color: cyan; padding: 2px"));