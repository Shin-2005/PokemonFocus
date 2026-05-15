import Header from './Header.tsx';
import Image from './Image.tsx'
import Timer from './Timer.tsx';

function App() {
  return (
    <>
      <Header />
      <div className="wrapper">
        <Image />
        <Timer />
      </div>

    </>
  );
}

export default App;
