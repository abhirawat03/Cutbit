import { useParams, Link } from "react-router-dom";

function RedirectError() {
  const { type } = useParams();

  const messages = {
    expired: {
      code: 410,
      title: "Link Expired",
      desc: "This short link has expired and is no longer active."
    },
    paused: {
      code: 403,
      title: "Link Paused",
      desc: "This link has been temporarily paused by the owner."
    },
    invalid: {
      code: 404,
      title: "Invalid Link",
      desc: "The short link you followed does not exist."
    }
  };

  const message = messages[type] || messages.invalid;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-white">
      <div className="text-center max-w-md">

        <p className="text-6xl font-bold text-red-400 mb-4">
          {message.code}
        </p>

        <h1 className="text-3xl font-semibold mb-4">
          {message.title}
        </h1>

        <p className="text-gray-400 mb-8">
          {message.desc}
        </p>

        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Go Home
        </Link>

      </div>
    </div>
  );
}

export default RedirectError;