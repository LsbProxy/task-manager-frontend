export default function handleError({ error }) {
    const { errors } = this.state;
    this.setState({ errors: [...errors, error] });
}
