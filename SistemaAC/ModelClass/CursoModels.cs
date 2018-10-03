using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SistemaAC.Data;
using SistemaAC.Models;

namespace SistemaAC.ModelClass
{
    public class CursoModels
    {
        private ApplicationDbContext context;

        public CursoModels(ApplicationDbContext context)
        {
            this.context = context;
        }

        internal List<Categoria> getCategorias()
        {
            return context.Categoria.Where(c => c.Estado == true).ToList();
        }
    }
}
