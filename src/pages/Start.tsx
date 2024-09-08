"use client";

import Button from "../components/Button";
import { GOOGLE_CLIENT_ID } from "../core/constants";
import useEphemeralKeyPair from "../core/useEphemeralKeyPair";
import { useNavigate } from "react-router-dom";

function Start() {
  const navigate = useNavigate();

  const ephemeralKeyPair = useEphemeralKeyPair();

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  const location = "http://localhost:3000";

  const searchParams = new URLSearchParams({
    /**
     * Replace with your own client ID
     */
    client_id: GOOGLE_CLIENT_ID,
    /**
     * The redirect_uri must be registered in the Google Developer Console. This callback page
     * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
     * derive the keyless account.
     *
     * window.location.origin == http://localhost:5173
     */
    redirect_uri: `${location}/callback`,
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs as it does not require a backend server.
     */
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  });
  redirectUrl.search = searchParams.toString();

  return (
    <main className='flex min-h-screen min-w-screen w-screen bg-primary relative flex-col items-center justify-between p-24'>
      <div className='w-1/2 h-screen  absolute top-0'>
        <img
          src={"/images/seezus_main.svg"}
          className='object-fit w-full h-full'
          alt='Main'
        />
      </div>
      <div className='absolute flex items-center justify-between self-center w-full px-[5vw] top-[10vh]'>
        <img
          src={"/images/seezus1.svg"}
          alt='small_1'
          width={200}
          height={200}
        />
        <img
          src={"/images/seezus3.svg"}
          alt='small_2'
          width={200}
          height={200}
        />
      </div>
      {/* <div className='w-'> */}
      <Button
        a={redirectUrl.toString()}
        style='px-[6vw]  text-4xl absolute bottom-[3vh] self-center'
        Title='Start Game'
      />
      {/* </div> */}

      <div className='absolute flex items-center justify-between self-center w-full px-[5vw] bottom-[12vh]'>
        <img
          src={"/images/seezus2.svg"}
          alt='small_1'
          width={200}
          height={200}
        />
        <img
          src={"/images/seezus4.svg"}
          alt='small_2'
          width={200}
          height={200}
        />
      </div>
    </main>
  );
}

export default Start;
