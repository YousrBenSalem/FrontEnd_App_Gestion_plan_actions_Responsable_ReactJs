import React from 'react'
import auth from '../services/auth';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


function NavBar() {
    const user = useSelector((state) => state.auth.user); // Récupérer l'utilisateur depuis Redux
 

console.log("user redux" , user)
const logOut = async () => {
  const token = localStorage.getItem('persist:token') 
    ? JSON.parse(localStorage.getItem('persist:token')).tokens 
    : null;

  if (!token) {
    console.log('No access token found to logout');
    return;
  }

  const Token = JSON.parse(token);
  const refreshToken = Token?.refreshToken;

  console.log("Refresh token:", refreshToken);

  try {
    await auth.logOut();

    console.log('Logout successful');
    localStorage.removeItem('persist:token');
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
};


  return (
  <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached         align-items-center bg-navbar-theme" id="layout-navbar">
          <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
            <a className="nav-item nav-link px-0 me-xl-4" href="#">
              <i className="bx bx-menu bx-sm" />
            </a>
          </div>
          <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
          
            <ul className="navbar-nav flex-row align-items-center ms-auto">
              {/* Place this tag where you want the button to render. */}
              
              {/* User */}
              <li className="nav-item navbar-dropdown dropdown-user dropdown">
                <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
                  <div className="avatar avatar-online">
  <img 
    src={user?.image ? `http://localhost:3000/storage/${user.image}` : "../assets/img/avatars/1.png"} 
    alt="User Avatar" 
    style={{ height: "40px", width: "40px" }} 
    className="rounded-circle" 
  />
</div>

                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="#">
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          <div className="avatar avatar-online">
                            <img src={`http://localhost:3000/storage/${user?.image}`|| "../assets/img/avatars/1.png"} alt style={{ height: "40px", width: "40px" }} 
    className="rounded-circle"  />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <span className="fw-semibold d-block">{user?.nom} {user?.prenom}</span>
                          <small className="text-muted">{user?.post}</small>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <div className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profil">
                      <i className="bx bx-user me-2" />
                      <span className="align-middle">Mon Profil</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/parametre">
                      <i className="bx bx-cog me-2" />
                      <span className="align-middle">Paramètres</span>
                    </Link>
                  </li>
                
                  <li>
                    <div className="dropdown-divider" />
                  </li>
                  <li>
                    <button onClick={()=>logOut()}  className="dropdown-item" >
                      <i className="bx bx-power-off me-2" />
                      <span className="align-middle">déconnexion</span>
                    </button>
                  </li>
                </ul>
              </li>
              {/*/ User */}
            </ul>
          </div>
        </nav>  )
}

export default NavBar