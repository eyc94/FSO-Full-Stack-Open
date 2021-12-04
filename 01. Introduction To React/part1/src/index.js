import ReactDOM from 'react-dom';
import App from './App';

let counter = 1;

const refresh = () => {
    ReactDOM.render(
        <App counter={counter} />,
        document.getElementById('root')
    );
};

setInterval(() => {
    refresh();
    counter += 1;
}, 1000);

// Old code before "Page re-rendering" section of part 1.
// ReactDOM.render(
//     <App />,
//     document.getElementById('root')
// );