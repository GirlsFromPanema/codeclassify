#include "Mesh.h"

Mesh::Mesh(std::vector<Vertex> vertex, std::vector<GLuint> indices, VAO name)
{
    Mesh::verts = vertex;
    Mesh::inds = indices;
    name.Bind();
    VBO VBO1(verts);
    EBO EBO1(inds);
    name.LinkAttrib(VBO1, 0, 3, GL_FLOAT, 9 * sizeof(float), (void *)0);
    name.LinkAttrib(VBO1, 1, 4, GL_FLOAT, 9 * sizeof(float), (void *)(3 * sizeof(float)));
    name.LinkAttrib(VBO1, 2, 2, GL_FLOAT, 9 * sizeof(float), (void *)(7 * sizeof(float)));
    name.Unbind();
    VBO1.Unbind();
    EBO1.Unbind();
}

void Mesh::Draw(VAO name)
{
    name.Bind();
    glDrawElements(GL_TRIANGLES, inds.size(), GL_UNSIGNED_INT, 0);
}