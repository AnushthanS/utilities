#include <iostream>
#include <cstring>
#include <unistd.h>
#include <sys/socket.h>
#include <sys/event.h>
#include <sys/time.h>
#include <sys/types.h>
#include <netinet/in.h>

#define PORT 8000
#define MAX_EVENTS 128

using namespace std;

int main ()
{
    int listen_fd = socket(AF_INET, SOCK_STREAM, 0);

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(PORT);
    
    
    int yes = 1;
    setsockopt(listen_fd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes));

   if (::bind(listen_fd, (sockaddr*)&addr, sizeof(addr)) < 0)
    {
        perror("bind failed");
        return 1;
    } 
    listen(listen_fd, SOMAXCONN);

    int kq = kqueue();

    struct kevent change;
    EV_SET(&change, listen_fd, EVFILT_READ, EV_ADD, 0, 0, NULL);

    kevent(kq, &change, 1, NULL, 0, NULL);

    struct kevent events[MAX_EVENTS];
    
    cout << "Echo server running on port " << PORT << endl;

    while (true)
    {
        int n = kevent(kq, NULL, 0, events, MAX_EVENTS, NULL);

        for (int i = 0; i < n; i++)
        {
            if (events[i].ident == listen_fd)
            {
                int client_fd = accept(listen_fd, NULL, NULL);
                cout << "New client connected: " << client_fd << endl;

                EV_SET(&change, client_fd, EVFILT_READ, EV_ADD, 0, 0, NULL);
                kevent(kq, &change, 1, NULL, 0, NULL);
            }
            else 
            {
                char buff[1024];

                int bytes = read(events[i].ident, buff, sizeof(buff));
                if (bytes <= 0)
                {
                    cout << "Client disconnected: " << events[i].ident << endl;
                    close(events[i].ident);
                    EV_SET(&change, events[i].ident, EVFILT_READ, EV_DELETE, 0, 0, NULL);
                    kevent(kq, &change, 1, NULL, 0, NULL);
                }
                else 
                {
                    write(events[i].ident, buff, bytes);
                }
            }
        }
    }

    close(listen_fd);
    return 0;
}
