FROM cosmtrek/air:v1.15.1

RUN wget -qO - https://pkgs-ce.cossacklabs.com/gpg | apt-key add -
RUN apt install -y apt-transport-https 
RUN echo "deb https://pkgs-ce.cossacklabs.com/stable/debian buster main" | tee /etc/apt/sources.list.d/cossacklabs.list
RUN apt update
RUN apt install -y libthemis-dev
