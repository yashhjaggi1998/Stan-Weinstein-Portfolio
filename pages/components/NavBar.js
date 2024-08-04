import { 
    Navbar, 
    Nav, 
    NavDropdown 
} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

export default function(){

return (
    <Navbar fixed="top" className="ps-4 pt-1 pb-0" bg="light" data-bs-theme="light">
        <Navbar.Brand>
            <img
                alt="YJ Brand"
                src="YJ1.png"
                width="90"
                height="100"
                className="align-top"
            />
        </Navbar.Brand>
        <Nav className="ms-5 me-auto">
            
            <Nav.Link href="/compound_interest_calculator" className="fs-5 me-4">ROI Calculator</Nav.Link>
            <NavDropdown title="Portfolio" id="portfolio" className="fs-5 me-4">
                <NavDropdown.Item href="/portfolio" className="fs-5">Current Portfolio</NavDropdown.Item>
                <NavDropdown.Item href="/fundamental_portfolio" className="fs-5">Fundamental Portfolio</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/closed_positions" className="fs-5 me-4">Closed Positions</Nav.Link>
            <Nav.Link href="/positions" className="fs-5">Live - Positions</Nav.Link>
        </Nav>
    </Navbar>
    );
}
