// export default function Footer() {
//     return (
//         <footer>
//             <p>© 2024 Core Circuit Software&emsp;</p>
//             <br />
//             <a href="https://corecircuitsoftware.github.io">About us</a>
//         </footer>
//     );
// }
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';  // Import Bootstrap components

export default function Footer() {
    return (
        <footer className="bg-light py-3 mt-auto">
            <Container>
                <Row className="justify-content-center">
                    <Col className="text-center" style={{whiteSpace: 'nowrap'}}>
                        <p className="mb-1">© 2024 Core Circuit Software</p>
                        <a href="https://corecircuitsoftware.github.io" className="text-secondary">About us</a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
