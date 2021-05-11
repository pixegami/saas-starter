FROM amazonlinux:2

RUN yum install -y python37 && \
    yum install -y python3-pip && \
    yum install -y zip && \
    yum clean all

RUN python3.7 -m pip install --upgrade pip && \
    python3.7 -m pip install virtualenv

RUN python3.7 -m venv base

RUN source base/bin/activate
RUN pip install bcrypt cryptography pyjwt -t ./python
RUN pip install cffi -t ./python
RUN pip install stripe -t ./python

RUN zip -r layer.zip ./python/

# Run these commands to create a 'layer.zip' for the base layer.
# docker rm layer-container
# docker build -t base-layer .
# docker run --name layer-container base-layer
# docker cp layer-container:layer.zip .