import Dashboard from "./components/Dashboard";

/**
 * The main entry point for the app.
 *
 * This component is responsible for rendering the Dashboard component,
 * which contains the main content of the app.
 */
const Home = () => {
    return (
        <main className="pt-20">
            <Dashboard />
        </main>
    );
};

export default Home;
