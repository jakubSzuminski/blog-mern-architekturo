import { Routes, Route } from 'react-router-dom';

import Header from './components/header';
import Home from './components/home';
import Auth from './components/auth';
import Footer from './components/footer';

import Post from './components/post/detailed';
import Contact from './components/contact';

import AdminPanel from './components/admin/panel';
import PostCreator from './components/admin/creator';

import NotFound from './components/404';

const App = () => {
  return (
    <>
    <Header/>

    <main>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/login" element={<Auth/>}/>
        <Route path="/register" element={<Auth signUp={true}/>}/>

        <Route path="/post/:slug" element={<Post/>}/>

        <Route path="/admin" element={<AdminPanel/>}/>
        <Route path="/admin/edit-post/:slug" element={<PostCreator/>}/>
        <Route path="/admin/creator" element={<PostCreator/>}/>

        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </main>

    <Footer/>
    </>
  );
}

export default App;
