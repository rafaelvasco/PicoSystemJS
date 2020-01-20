import App from 'components/App';
import 'main.css';

const main = async () => {
    const app = new App();
    app.init();
}

main().then(() => console.log('PicoSystem Started'));