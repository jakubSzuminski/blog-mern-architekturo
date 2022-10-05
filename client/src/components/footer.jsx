const Footer = () => {
    const today = new Date();

    return (
        <footer>
            <p className="center">Wszystkie prawa zastrzeżone &copy; {today.getFullYear()}, Architekturo.pl</p>
        </footer>
    )
}

export default Footer;