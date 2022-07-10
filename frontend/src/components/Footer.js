function Footer() {

  //new Date().getFullYear()
  
    return (
        <footer className="footer">
          <p className="footer__copyright">© MESTO Russia {new Date().getFullYear()}</p>
        </footer>
    )
}

export default Footer