import http from "./http";

const quitAudit = (userName) => {
    http.get('basicinfo/clearData', {params: {userName: userName}});

    window.opener = null;
    window.open("", "_self");
    window.close();
}

export {quitAudit}

