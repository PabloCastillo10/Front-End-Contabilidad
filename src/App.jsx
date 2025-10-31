import routes from './routes.jsx';
import { useRoutes } from 'react-router-dom';

 const App =()  =>{
  let element  = useRoutes(routes);
  return (
    <>
      {element}
    </>
  )
}

export default App;