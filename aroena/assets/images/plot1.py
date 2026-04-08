import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Function
x = np.linspace(0, 4, 100)
y = -x**2 + 4*x

# Create rotation
theta = np.linspace(0, 2*np.pi, 50)
X, Theta = np.meshgrid(x, theta)

Y = -X**2 + 4*X

Z = Y * np.sin(Theta)
Y_rot = Y * np.cos(Theta)

# Plot
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.plot_surface(X, Y_rot, Z)

ax.set_title("Rotation about x-axis (Disks Method)")
ax.set_xlabel("x")
ax.set_ylabel("y")
ax.set_zlabel("z")

plt.show()